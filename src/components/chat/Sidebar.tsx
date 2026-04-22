import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GraduationCap, Plus, MessageSquare, LogOut, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConversationItem = {
  id: string;
  title: string;
  updated_at: string;
};

type Props = {
  conversations: ConversationItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onSignOut: () => void;
  userEmail?: string;
};

export const Sidebar = ({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onSignOut,
  userEmail,
}: Props) => {
  return (
    <aside className="w-72 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col h-full border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="font-display text-lg font-semibold leading-none">
            Bridge the Gap
          </div>
        </div>
        <Button onClick={onNew} variant="secondary" className="w-full justify-start gap-2 bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80 border-0">
          <Plus className="h-4 w-4" /> New chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {conversations.length === 0 && (
            <p className="text-xs text-sidebar-foreground/60 px-3 py-4 text-center">
              No conversations yet.
            </p>
          )}
          {conversations.map((c) => (
            <div
              key={c.id}
              className={cn(
                "group flex items-center gap-2 rounded-md px-2.5 py-2 text-sm cursor-pointer transition-colors",
                activeId === c.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/60 text-sidebar-foreground/90"
              )}
              onClick={() => onSelect(c.id)}
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-70" />
              <span className="truncate flex-1">{c.title || "New chat"}</span>
              <button
                aria-label="Delete conversation"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(c.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-sidebar-border"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/70 truncate px-2 mb-2">{userEmail}</div>
        <Button
          variant="ghost"
          onClick={onSignOut}
          className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </aside>
  );
};
