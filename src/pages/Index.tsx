import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { GraduationCap, Sparkles, GraduationCap as Cap, Wallet, BookOpen, ArrowRight } from "lucide-react";
// eslint-disable-next-line

const Index = () => {
  const { user } = useAuth();
  const ctaHref = user ? "/chat" : "/auth";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <GraduationCap className="h-6 w-6" />
            <span className="font-display text-xl font-semibold">Bridge the Gap</span>
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <Button asChild>
                <Link to="/chat">Open chat</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-soft" aria-hidden />
          <div className="relative max-w-4xl mx-auto px-4 py-20 md:py-28 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Your South African university & bursary guide
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight text-foreground text-balance">
              Bridge the gap between matric and university.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Get clear, step-by-step guidance on applications, APS, NSFAS and bursaries at Wits, UCT, UP, UJ, UFS and TUT — from a friendly mentor that's always ready.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button size="lg" asChild className="gap-2">
                <Link to={ctaHref}>
                  Start chatting <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#how">How it works</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="how" className="max-w-5xl mx-auto px-4 py-20">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Cap,
                title: "University applications",
                body: "APS, subject requirements, deadlines and documents — for Wits, UCT, UP, UJ, UFS and TUT.",
              },
              {
                icon: Wallet,
                title: "NSFAS & bursaries",
                body: "Find out if you qualify for NSFAS, Allan Gray Orbis and other reputable funding options.",
              },
              {
                icon: BookOpen,
                title: "Course guidance",
                body: "Clear breakdowns of programmes, selection criteria and what to do if your application is rejected.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elegant transition-shadow"
              >
                <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 pb-24">
          <div className="rounded-3xl bg-hero text-primary-foreground px-8 py-14 text-center shadow-elegant">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-balance">
              Ready to take the next step?
            </h2>
            <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto">
              Create a free account to save your conversations and pick up where you left off.
            </p>
            <Button size="lg" variant="secondary" asChild className="mt-6 gap-2">
              <Link to={ctaHref}>
                Let's get you in <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Bridge the Gap · Always verify details on official university and bursary sites.
      </footer>
    </div>
  );
};

export default Index;
