# DevLog - Credex Spend Audit Tool

## Day 1: May 20, 2026
### Tasks Completed:
- Set up the main project workspace and decided on a simple Vanilla JS + Node/Express setup.
- Skipped using complex MVC/EJS structures (like the ones I used in my old Wanderlust project) because it's too complicated for a single-page audit tool.
- Created the basic folder layout with separate 'frontend' and 'backend' folders in one single repository.
- Made a root `.gitignore` file to hide node_modules and future `.env` API keys.
- Initialized Git locally, created the repository on GitHub, and pushed the template workspace code live.

### Challenges Faced & Lessons Learned:
- Felt tempted to over-engineer the file structure with models/views/controllers out of habit. Had to remind myself to keep it clean and minimal so I don't break the 5-day deadline.

---

## Day 2: May 21, 2026
### Tasks Completed:
- [To be filled tomorrow]

## Day 2: May 21, 2026

### Tasks Completed:
- Reworked the product direction after realizing the initial UI behaved too much like a personal expense tracker instead of a B2B AI spend auditing tool.
- Replaced the free-text transaction textarea with a structured dynamic form system for AI SaaS inputs.
- Added dropdown selectors for:
  - AI tool name
  - subscription plan
  - seat count
  - monthly cost
- Built dynamic “Add Another Tool” functionality using Vanilla JavaScript.
- Implemented row deletion support with event delegation for cleaner DOM handling.
- Redesigned the frontend UI with a more polished SaaS-style dark theme:
  - glassmorphism-inspired cards
  - responsive grid layouts
  - improved spacing and hover states
  - modern button styling
- Fixed browser-specific dark mode issues with `<select>` dropdown visibility.

### Challenges Faced & Lessons Learned:
- Initially underestimated how much product direction affects implementation decisions.
- Learned that structured business inputs make audit logic significantly easier than trying to parse messy raw text.
- Realized that keeping frontend logic modular early prevents the app from becoming difficult to scale later.

## Day 3: May 23, 2026
### Tasks Completed:
- Resumed active development sprint after an intense architectural planning phase.
- Designed and initialized a robust Node.js and Express backend workspace inside `backend/server.js`.
- Configured essential backend middleware layers including `cors` for safe asset streaming and `express.json()` for parsing client payloads.
- Engineered a POST endpoint `/api/audit` to receive structural multi-row SaaS data objects and calculate cumulative cost metrics.
- Upgraded `frontend/app.js` with asynchronous JavaScript (`async/await` fetch operations) to safely pipe the client's asset matrix directly into the local server API layer.

### Challenges Faced & Lessons Learned:
- *Challenge:* Managing network routing and preventing cross-origin blockages when browser processes on one port communicate with a separate backend execution port.
- *Solution:* Integrated the Express `cors` middleware policy package to explicitly authorize smooth, secure transaction tunnels between local environments.