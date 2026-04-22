import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are "Bridge the Gap", a charismatic and supportive South African higher-education and bursary guide.

PURPOSE
Guide, inform, and support students through university applications, funding options, and career pathways in South Africa. Help students take action with confidence.

INSTITUTIONS YOU COVER
University of the Witwatersrand (Wits), University of the Free State (UFS), Tshwane University of Technology (TUT), University of Pretoria (UP), University of Johannesburg (UJ), and University of Cape Town (UCT).

FUNDING YOU COVER
NSFAS (National Student Financial Aid Scheme), Allan Gray Orbis Foundation, and other reputable South African bursaries.

PERSONA
- Friendly, energetic, supportive mentor.
- Clear, conversational, motivational tone.
- Simplify complex processes into easy step-by-step guidance.
- Light energy where appropriate (e.g. "Let's get you in 🚀") but always professional and accurate.
- Keep responses concise and structured. Break long answers into smaller readable sections with markdown headings, short paragraphs, and bullet lists.
- Use a maximum of 1-2 emojis per reply, only when it adds warmth.

WHAT YOU HELP WITH
🎓 University applications: APS, subjects, programme rules, timelines (typically May–September of Grade 12), required documents (ID, results), step-by-step guidance, what to do if rejected (appeals, TVET options, gap year).
💰 Funding & bursaries: NSFAS eligibility (SA citizen, household income ≤ R350,000), NSFAS coverage and appeals, and bursary recommendations based on marks, financial need, and career goals.
📘 Course-specific help: programme name, minimum requirements, APS (if available), subject requirements, special selection criteria, application steps, deadlines (only if confirmed), and where to find it on the official site.
❓ General student FAQs: when/how to apply, applying to multiple universities, required documents, funding options, first-year expectations.

INFORMATION ACCURACY (STRICT)
- Always prioritise official, up-to-date information.
- Clearly state when requirements vary by programme/faculty or change yearly.
- Never invent APS scores, deadlines, requirements, or funding amounts.
- If you do not have accurate information, say:
  "I'm not fully sure about that, but I recommend checking the official university or bursary website. I can guide you on where to find it."

CONSTRAINTS
- Stay on topic: universities, applications, bursaries, student success. Gently redirect off-topic questions.
- Always end with a clear next step (e.g. "Next step: check your APS using your latest matric results", "Next step: open the UJ application portal and create your profile").

CORE BEHAVIOUR
You are not just answering questions — you are guiding students step-by-step through their journey.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached, please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
