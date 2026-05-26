# AI Spend Audit

A free web tool for startup founders and engineering managers to instantly audit their team's AI tool spending — surfacing overspend, redundant subscriptions, and cheaper alternatives. Built as a lead-generation asset for Credex, which sells discounted AI infrastructure credits.

**Who it's for:** Engineering managers and CTOs at seed-to-Series A startups paying for 2+ AI tools and suspecting they're not spending optimally.

**Live URL:** (deploying soon)

---

## Screenshots

> _Add 3+ screenshots or a Loom/YouTube link here before submission_

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas URI (free tier works)
- Gemini API key (free tier at aistudio.google.com)

### Run Locally

```bash
# Clone the repo
git clone https://github.com/smaranikabiswal/credex-spend-audit
cd credex-spend-audit

# Install backend dependencies
cd backend
npm install

# Create .env file
cp .env.example .env
# Fill in: MONGODB_URI, LLM_API_KEY, PORT

# Start backend
npm start

# In a new terminal, serve frontend
cd ../frontend
# Open index.html with Live Server (VS Code) or:
npx serve .
```

### Deploy

**Backend:** Deploy `backend/` to Render as a Node.js web service. Set env vars in Render dashboard.

**Frontend:** Deploy `frontend/` to Vercel. Update the fetch URLs in `app.js` to point to your Render backend URL.

---

## Decisions

1. **Vanilla JS over React** — The audit UI is form-based with minimal state. React would add bundle weight and build complexity for no UX gain. Vanilla JS with explicit DOM manipulation keeps the frontend deployable as static files with zero build step, which means instant Vercel deploys and easier debugging.

2. **Gemini API over Anthropic API for the summary** — Gemini 2.5 Flash has a generous free tier with no credit card required, removing friction for reviewers trying to run the project locally. The prompt is model-agnostic and the fallback template ensures the audit works regardless.

3. **MongoDB over Supabase/Postgres** — The audit data is document-shaped (variable tool arrays, nested redundancy objects). MongoDB's schema flexibility meant I could iterate on the data model during the week without migrations. For 10k audits/day I'd reconsider — see ARCHITECTURE.md.

4. **Deterministic audit engine, not LLM-driven** — The assignment explicitly flagged this. LLM reasoning for financial math is unreliable and non-auditable. A finance person reading "Cursor Business for 2 users wastes $40/mo because Pro covers the same features at half the price" needs that to be a traceable rule, not a hallucination. The LLM is only used for the narrative summary layer.

5. **Email captured after value shown, never before** — Standard SaaS lead-gen wisdom but easy to get wrong. The audit runs fully before any email prompt appears. Users who see savings first convert at 3–5x the rate of users gated before the value moment. The gate appears contextually: high-savings users see a Credex consultation CTA, low-savings users see a "notify me" opt-in.