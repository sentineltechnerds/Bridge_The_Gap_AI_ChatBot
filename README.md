# Bridge the Gap 🎓

> An AI-powered chatbot helping South African students navigate university applications, bursaries, and student readiness, no login, no setup, just ask.
---

## ✨ About

**Bridge the Gap** is a friendly, supportive academic mentor built for students in South Africa. It answers FAQs about:

- 🏫 **Universities** — choosing where to apply
- 📝 **Applications** — process, documents, deadlines
- 💰 **Bursaries** — funding options, eligibility
- 🎯 **Student success & readiness** — preparing for higher education

The bot acts like a trusted mentor: clear, motivational, realistic, and always nudging the user toward a concrete next step.

---

## 🚀 Live Demo

Open the app and start chatting — no signup required.
Link:  https://hope-hub-za.lovable.app

---

## 🧩 Key Features

| Feature | Description |
|---|---|
| **No login required** | Open the page and start chatting immediately. |
| **Streaming responses** | Replies appear word-by-word for a natural feel. |
| **Session-based chat** | Conversations live in-memory and reset on refresh or "New chat". |
| **Mentor persona** | Consistent tone — clear, motivational, locally relevant to South Africa. |
| **Mandatory greeting** | Standard opening response when the user says "Hi" / "Hello". |
| **Anti-hallucination guardrails** | Will not invent APS scores, deadlines, or bursary criteria. |
| **Topic guardrails** | Off-topic questions are gently redirected back to core areas. |

---

## 🏗️ Architecture
1. The user types a question in the chat composer.
2. The React app sends the full message history to the `chat` edge function.
3. The edge function injects the **Bridge the Gap** system prompt and forwards the request to the Lovable AI Gateway.
4. The AI response is streamed back as Server-Sent Events and rendered token-by-token.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Lovable Cloud (Supabase) Edge Function (Deno)
- **AI Provider:** Lovable AI Gateway — model `google/gemini-3-flash-preview`
- **Streaming:** Server-Sent Events (SSE)


## 📁 Project Structure
---

## 🤖 The Bot's Personality (System Prompt Highlights)

- **Tone:** clear, conversational, motivational, lightly humorous, professional.
- **Emojis:** maximum one per message, only when it fits naturally.
- **Greeting rule:** when greeted, replies *exactly* with:
  > "I'm Bridge the Gap, your go-to guide for everything related to university applications and bursaries in South Africa. How can I help you today?"
- **No hallucination:** never invents APS scores, entry requirements, deadlines, or bursary values.
- **Uncertainty fallback:** when unsure, replies:
  > "I'm not fully sure about that, but I recommend checking the official university or bursary website. I can guide you on where to find it."
- **Stay on topic:** only universities, applications, bursaries, and student success.
- **Encourage action:** every reply ends with a clear next step.

---

## ⚙️ Running Locally

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
The app will be available at http://localhost:5173.

Environment Variables
Auto-managed by Lovable Cloud:

VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY




