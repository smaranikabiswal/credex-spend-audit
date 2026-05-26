## Day 1 — 2026-05-20

**Hours worked:** 2

**What I did:**
Set up the main project workspace and decided on Vanilla JS + Node/Express. 
Skipped MVC/EJS structures (used in my Wanderlust project) — too complex 
for a single-page audit tool. Created folder layout with separate frontend 
and backend directories. Made root .gitignore for node_modules and .env. 
Initialized Git locally, created GitHub repo, pushed initial workspace.

**What I learned:**
Felt tempted to over-engineer with models/views/controllers out of habit. 
Had to remind myself to keep it minimal to meet the deadline.

**Blockers / what I'm stuck on:**
Nothing blocking yet — setup phase went cleanly.

**Plan for tomorrow:**
Rethink the UI direction. The initial concept felt too much like a personal 
expense tracker. Need to make it more B2B SaaS-appropriate.

---

## Day 2 — 2026-05-21

**Hours worked:** 4

**What I did:**
Reworked the product direction after realizing the initial UI behaved too 
much like a personal expense tracker instead of a B2B AI spend auditing tool. 
Replaced the free-text textarea with a structured dynamic form — dropdowns 
for tool name, subscription plan, seat count, monthly cost. Built dynamic 
"Add Another Tool" with vanilla JS and row deletion via event delegation. 
Redesigned UI with glassmorphism dark theme, responsive grid layouts, 
improved spacing and hover states. Fixed browser-specific dark mode issues 
with select dropdown visibility.

**What I learned:**
Structured business inputs make audit logic significantly easier than parsing 
messy raw text. Keeping frontend logic modular early prevents scaling 
problems later. Product direction affects every implementation decision — 
changing direction on Day 2 was the right call even though it cost time.

**Blockers / what I'm stuck on:**
Need to plan the backend architecture before writing any server code. 
Spending Day 3 on architectural planning before touching the backend.

**Plan for tomorrow:**
Architectural planning day — no code. Map out the data flow, API shape, 
and MongoDB schema before building.

---

## Day 3 — 2026-05-22

**Hours worked:** 0

**What I did:**
Family urgency

**What I learned:**
N/A

**Blockers / what I'm stuck on:**
N/A

**Plan for tomorrow:**
Start backend — Node/Express server, CORS setup, /api/audit endpoint, 
async fetch from frontend.

---

## Day 4 — 2026-05-23

**Hours worked:** 5

**What I did:**
Designed and initialized Node.js + Express backend in backend/server.js. 
Configured CORS middleware and express.json() for payload parsing. Built 
POST /api/audit endpoint to receive multi-row SaaS data and calculate 
cumulative cost metrics. Upgraded frontend/app.js with async/await fetch 
to pipe client data into the local API. Verified end-to-end data flow 
from form inputs through Express.

**What I learned:**
Managing cross-origin requests between browser (one port) and backend 
(another port) requires explicit CORS configuration. The express cors 
package resolved the local environment routing issue cleanly.

**Blockers / what I'm stuck on:**
Generic AI conclusions add no value — the report needs explicit cost 
breakdowns and actionable steps, not vague summaries. Rethinking the 
Gemini prompt structure tomorrow.

**Plan for tomorrow:**
Integrate Gemini API, add dotenv for key management, wire up Chart.js 
for the results visualization.

---

## Day 5 — 2026-05-24

**Hours worked:** 6

**What I did:**
Integrated Google AI SDK (@google/genai) with Gemini 2.5 Flash. Implemented 
dotenv for secure API key management. Regenerated .gitignore as clean text 
file to prevent credential leaks. Updated app.js to sanitize and map dynamic 
row data into a single payload array. Verified live end-to-end flow from 
frontend through Express to Gemini. Added Chart.js CDN and fixed canvas 
re-rendering using a tracking instance variable.

**What I learned:**
Node couldn't read ES module imports — fixed by adding "type": "module" 
to backend/package.json. Hit this error: SyntaxError: Cannot use import 
statement in a module. Adding the type field resolved it immediately. 
Lesson: always check module type before debugging deeper.

**Blockers / what I'm stuck on:**
Need MongoDB persistence layer — right now results aren't saved anywhere. 
Also need to write the deterministic audit logic properly.

**Plan for tomorrow:**
MongoDB integration, AuditReport schema, refactor /api/audit to save 
results and return _id for share links.

---

## Day 6 — 2026-05-25

**Hours worked:** 5

**What I did:**
Integrated MongoDB and Mongoose into backend/server.js. Defined AuditReport 
schema to store total spend, optimized totals, and AI breakdown for every 
scan. Refactored /api/audit to save results to database first then return 
generated _id to frontend. Improved mobile responsiveness with CSS grid 
template changes. Fixed massive layout gaps caused by duplicate 
chart-container divs and a rogue class="class=" typo in HTML.

**What I learned:**
The UI had blank gaps between chart and executive summary. Root cause: 
duplicate hardcoded chart-container div in index.html fighting with the 
one generated dynamically in app.js. Deleted the static one. The MONGODB_URI 
is in .env and verified in .gitignore before every commit — learned to check 
this explicitly, not assume.

**Blockers / what I'm stuck on:**
All required MD documentation files still need to be written. Tests and 
CI workflow not yet set up. Deployment pending.

**Plan for tomorrow:**
Write all 11 required MD files, write 5 unit tests, configure GitHub 
Actions CI, deploy frontend and backend.

---

## Day 7 — 2026-05-26

**Hours worked:** 6

**What I did:**
Wrote 5 Node.js unit tests in audit.test.js covering the deterministic 
audit engine. Configured GitHub Actions CI workflow (.github/workflows/ci.yml) 
to run lint and tests on every push to main. Deployed backend to Render 
and frontend to Vercel. Wrote all 11 required documentation files: README, 
ARCHITECTURE, REFLECTION, TESTS, PRICING_DATA, PROMPTS, GTM, ECONOMICS, 
USER_INTERVIEWS, LANDING_COPY, METRICS.

**What I learned:**
Node's native test runner (node --test) works without Jest — simpler 
and zero extra dependencies. GitHub Actions requires node-version: '18' 
explicitly or it defaults to an older version that doesn't support 
node:test. Deployment pathing issues resolved by consolidating 
package.json execution scripts.

**Blockers / what I'm stuck on:**
Transactional email (Resend integration) is still a stub — documented 
as known gap in REFLECTION.md.

**Plan for tomorrow:**
Submitted. Rest.