# AI Spend Audit

A free web tool for startup founders and engineering managers to instantly audit their team's AI tool spending — surfacing overspend, redundant subscriptions, and cheaper alternatives. Built as a lead-generation asset for Credex, which sells discounted AI infrastructure credits.

**Who it's for:** Engineering managers and CTOs at seed-to-Series A startups paying for 2+ AI tools and suspecting they're not spending optimally.

**Live URL:** https://credex-spend-audit-liart.vercel.app

---

## Screenshots

![Input Form](./screenshots/screenshot-1-form.png)
![Audit Results](./screenshots/screenshot-2-results.png)
![Lead Capture](./screenshots/screenshot-3-lead.png)
![PDF Export](./screenshots/screenshot-4-pdf.png)

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas URI (free tier works)
- Gemini API key (free tier at aistudio.google.com)

### Run Locally

```bash
git clone https://github.com/smaranikabiswal/credex-spend-audit
cd credex-spend-audit

cd backend
npm install

cp .env.example .env

npm start

cd ../frontend
npx serve .
```

### Deploy

**Backend:** Deploy `backend/` to Render as a Node.js web service. Set env vars in Render dashboard.

**Frontend:** Deploy `frontend/` to Vercel. Update `BACKEND_URL` in `app.js` to point to your Render backend URL.

---

## Decisions

1. **Vanilla JS over React** — The audit UI is form-based with minimal state. React would add bundle weight and build complexity for no UX gain. Vanilla JS keeps the frontend deployable as static files with zero build step, which means instant Vercel deploys and easier debugging.

2. **Gemini API over Anthropic API for the summary** — Gemini 2.5 Flash has a generous free tier with no credit card required, removing friction for anyone running the project locally. The prompt is model-agnostic and the fallback template ensures the audit works regardless of API availability.

3. **MongoDB over Supabase/Postgres** — The audit data is document-shaped with variable tool arrays and nested redundancy objects. MongoDB's schema flexibility meant I could iterate on the data model during the week without migrations.

4. **Deterministic audit engine, not LLM-driven** — The assignment explicitly flagged this. LLM reasoning for financial math is unreliable and non-auditable. A finance person reading the reasoning needs it to be a traceable rule, not a hallucination. The LLM is only used for the narrative summary layer.

5. **Email captured after value shown, never before** — The audit runs fully before any email prompt appears. Users who see their savings first convert at significantly higher rates than users gated before the value moment.