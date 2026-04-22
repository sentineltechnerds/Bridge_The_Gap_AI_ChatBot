import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUGGESTIONS = [
  "What's the APS I need for BCom at UP?",
  "Am I eligible for NSFAS?",
  "How do I apply to Wits and UJ at the same time?",
  "What documents do I need to apply?",
];

export const EmptyState = ({ onPick }: { onPick: (p: string) => void }) => {
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center py-12">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-elegant mb-5">
          <GraduationCap className="h-7 w-7" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground text-balance">
          Let's get you into university 🎓
        </h1>
        <p className="mt-3 text-muted-foreground text-balance">
          I'm your guide for South African university applications, NSFAS, and bursaries.
          Ask me anything — I'll walk you through it step by step.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 gap-2.5 text-left">
          {SUGGESTIONS.map((s) => (
            <Button
              key={s}
              variant="outline"
              onClick={() => onPick(s)}
              className="h-auto py-3 px-4 justify-start text-sm font-normal text-foreground/80 hover:text-foreground hover:border-primary/40 hover:bg-secondary/60"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
