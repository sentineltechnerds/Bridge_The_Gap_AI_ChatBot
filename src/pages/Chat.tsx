import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar, ConversationItem } from "@/components/chat/Sidebar";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { EmptyState } from "@/components/chat/EmptyState";
import { toast } from "@/hooks/use-toast";
import { Loader2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type Msg = { id?: string; role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const Chat = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auth gate
  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("conversations")
      .select("id,title,updated_at")
      .order("updated_at", { ascending: false });
    if (error) {
      toast({ title: "Couldn't load chats", description: error.message, variant: "destructive" });
      return;
    }
    setConversations(data ?? []);
  }, [user]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load messages for active conversation
  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    setLoadingMsgs(true);
    supabase
      .from("messages")
      .select("id,role,content")
      .eq("conversation_id", activeId)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          toast({ title: "Couldn't load messages", description: error.message, variant: "destructive" });
        } else {
          setMessages(
            (data ?? []).map((m) => ({
              id: m.id,
              role: m.role as "user" | "assistant",
              content: m.content,
            }))
          );
        }
        setLoadingMsgs(false);
      });
  }, [activeId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  const handleNew = () => {
    setActiveId(null);
    setMessages([]);
    setInput("");
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("conversations").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    if (activeId === id) handleNew();
    setConversations((prev) => prev.filter((c) => c.id !== id));
  };

  const ensureConversation = async (firstMessage: string): Promise<string | null> => {
    if (activeId) return activeId;
    if (!user) return null;
    const title = firstMessage.slice(0, 60).trim() || "New chat";
    const { data, error } = await supabase
      .from("conversations")
      .insert({ user_id: user.id, title })
      .select("id,title,updated_at")
      .single();
    if (error || !data) {
      toast({ title: "Couldn't start chat", description: error?.message, variant: "destructive" });
      return null;
    }
    setConversations((prev) => [data, ...prev]);
    setActiveId(data.id);
    return data.id;
  };

  const send = async (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text || streaming || !user) return;
    setInput("");
    setStreaming(true);

    const convId = await ensureConversation(text);
    if (!convId) {
      setStreaming(false);
      return;
    }

    const userMsg: Msg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages([...newMessages, { role: "assistant", content: "" }]);

    // Persist user message
    await supabase
      .from("messages")
      .insert({ conversation_id: convId, user_id: user.id, role: "user", content: text });

    let assistantSoFar = "";
    const updateAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: assistantSoFar };
        return copy;
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!resp.ok) {
        let msg = "Something went wrong.";
        try {
          const j = await resp.json();
          msg = j.error || msg;
        } catch {}
        if (resp.status === 429) msg = "Rate limit reached. Please try again in a moment.";
        if (resp.status === 402) msg = "AI credits exhausted. Add funds in Lovable.";
        throw new Error(msg);
      }
      if (!resp.body) throw new Error("No response stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;

      while (!done) {
        const { done: rDone, value } = await reader.read();
        if (rDone) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (c) updateAssistant(c);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Persist assistant message
      if (assistantSoFar) {
        await supabase.from("messages").insert({
          conversation_id: convId,
          user_id: user.id,
          role: "assistant",
          content: assistantSoFar,
        });
        // Touch conversation updated_at + maybe set first title
        await supabase
          .from("conversations")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", convId);
        loadConversations();
      }
    } catch (err: any) {
      toast({
        title: "Chat error",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      });
      // Remove the empty assistant placeholder
      setMessages((prev) => {
        const copy = [...prev];
        if (copy.length && copy[copy.length - 1].role === "assistant" && !copy[copy.length - 1].content) {
          copy.pop();
        }
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const sidebar = (
    <Sidebar
      conversations={conversations}
      activeId={activeId}
      onSelect={setActiveId}
      onNew={handleNew}
      onDelete={handleDelete}
      onSignOut={async () => {
        await signOut();
        navigate("/", { replace: true });
      }}
      userEmail={user.email ?? undefined}
    />
  );

  return (
    <div className="h-screen flex bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">{sidebar}</div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex items-center gap-2 px-3 py-2 border-b border-border bg-background">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-sidebar border-sidebar-border">
              {sidebar}
            </SheetContent>
          </Sheet>
          <div className="font-display text-lg font-semibold text-primary">Bridge the Gap</div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {loadingMsgs ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <EmptyState onPick={(p) => send(p)} />
          ) : (
            <div className="pb-6">
              {messages.map((m, i) => (
                <ChatMessage
                  key={m.id ?? i}
                  role={m.role}
                  content={m.content}
                  streaming={streaming && i === messages.length - 1 && m.role === "assistant"}
                />
              ))}
            </div>
          )}
        </div>

        <ChatComposer
          value={input}
          onChange={setInput}
          onSend={() => send()}
          disabled={streaming}
          loading={streaming}
        />
      </div>
    </div>
  );
};

export default Chat;
