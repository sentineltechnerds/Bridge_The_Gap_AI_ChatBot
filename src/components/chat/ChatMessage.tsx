import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GraduationCap, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
};

export const ChatMessage = ({ role, content, streaming }: Props) => {
  const isUser = role === "user";
  return (
    <div className={cn("w-full animate-fade-in", isUser ? "bg-transparent" : "bg-muted/40")}>
      <div className="max-w-3xl mx-auto px-4 py-5 flex gap-4">
        <div
          className={cn(
            "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
            isUser
              ? "bg-secondary text-secondary-foreground border border-border"
              : "bg-primary text-primary-foreground"
          )}
        >
          {isUser ? <UserIcon className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <div className="text-xs font-medium text-muted-foreground mb-1">
            {isUser ? "You" : "Bridge the Gap"}
          </div>
          {isUser ? (
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">{content}</p>
          ) : (
            <div className="prose-chat text-foreground leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || " "}</ReactMarkdown>
              {streaming && (
                <span className="inline-block w-1.5 h-4 bg-primary align-middle ml-0.5 animate-blink" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
