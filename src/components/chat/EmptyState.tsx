import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUGGESTIONS = [
  "How do I apply to university in South Africa?",
  "What documents do I need for my application?",
  "What is APS and how do I calculate it?",
  "Am I eligible for NSFAS funding?",
  "When do university applications open and close?",
  "What can I do if my application is rejected?",
];

export const EmptyState = ({ onPick }: { onPick: (p: string) => void }) => {
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center py-12">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-elegant mb-5">
          <GraduationCap className="h-7 w-7" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground text-balance">
          Hi! I'm Bridge the Gap 🎓
        </h1>
        <p className="mt-3 text-muted-foreground text-balance">
          Ask me anything about applying to South African universities — APS, requirements,
          documents, deadlines, NSFAS and bursaries. I'm here to help students and parents.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 gap-2.5 text-left">
          {SUGGESTIONS.map((s) => (
            <Button
              key={s}
              variant="outline"
              onClick={() => onPick(s)}
              className="h-auto py-3 px-4 justify-start text-sm font-normal text-foreground/80 hover:text-foreground hover:border-primary/40 hover:bg-secondary/60 whitespace-normal"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
