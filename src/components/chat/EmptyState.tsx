import { GraduationCap } from "lucide-react";

export const EmptyState = (_: { onPick: (p: string) => void }) => {
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
          Ask me anything about applying to South African universities.
        </p>
      </div>
    </div>
  );
};
