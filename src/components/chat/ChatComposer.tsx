import { useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export const ChatComposer = ({ value, onChange, onSend, disabled, loading }: Props) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) onSend();
    }
  };

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  };

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="relative flex items-end gap-2 rounded-2xl border border-border bg-card shadow-card focus-within:ring-2 focus-within:ring-ring/40 transition-all">
          <textarea
            ref={ref}
            value={value}
            rows={1}
            placeholder="Ask about APS, NSFAS, deadlines, or a specific course…"
            onChange={(e) => {
              onChange(e.target.value);
              autoResize(e.currentTarget);
            }}
            onKeyDown={handleKey}
            disabled={disabled}
            className="flex-1 resize-none bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none max-h-[200px]"
          />
          <Button
            type="button"
            size="icon"
            onClick={onSend}
            disabled={disabled || !value.trim()}
            className="m-1.5 h-9 w-9 rounded-xl"
            aria-label="Send"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Bridge the Gap can make mistakes. Always verify deadlines & APS on official sites.
        </p>
      </div>
    </div>
  );
};
