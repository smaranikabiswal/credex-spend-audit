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

## Day 4: May 24, 2026
### Tasks Completed:
- Upgraded to full-stack by integrating the native Google AI SDK (`@google/genai`) with Gemini 2.5 Flash.
- Implemented `dotenv` to securely manage API keys and credentials locally.
- Regenerated the root `.gitignore` as a clean text file to prevent credential leaks.
- Updated `app.js` loop to sanitize and map dynamic row data into a single payload array.
- Verified live end-to-end data flow from the frontend inputs through Express to Gemini.
- Added Chart.js CDN and fixed canvas re-rendering states using a tracking instance.

### Challenges Faced & Lessons Learned:
- *Product Pivot:* Realized generic conclusions add no value; the report must explicitly break down cost waste and actionable mitigation steps.
- *Syntax Error:* Hit an Express crash because Node couldn't read modern ES module imports.
- *Solution:* Added `"type": "module"` to `backend/package.json` to resolve the runtime crash and bring the AI pipeline live.
- *Lesson:* Stepped away from the rigid 5-day deadline to focus on building a robust MongoDB layer tomorrow with a fresh brain.

## Day 5: May 25, 2026
### Tasks Completed:
- Integrated MongoDB and Mongoose into `backend/server.js` to create a persistent database layer.
- Defined an `AuditReport` schema to store total spend, optimized totals, and the detailed AI breakdown for every scan.
- Refactored the `/api/audit` route to save the AI results to the database first, then return the generated `_id` to the frontend dashboard.
- Improved mobile responsiveness across the dashboard by tweaking CSS grid templates (`1fr` stacking) and adjusting body padding for smaller screens.
- Cleaned up static HTML to fix massive layout gaps caused by duplicate `chart-container` divs and a rogue `class="class="` syntax typo.

### Challenges Faced & Lessons Learned:
- *Bug:* The UI suddenly had massive blank gaps between the chart and the executive summary.
- *Solution:* Realized I had a duplicate hardcoded `<div class="chart-container">` in my `index.html` fighting with the one generated dynamically in `app.js`. Deleted the static one to let JavaScript handle the rendering.
- *Challenge:* Securing the MongoDB connection string so it doesn't leak on GitHub.
- *Solution:* Added `MONGODB_URI` to my local `.env` file and verified it was listed in my `.gitignore` before committing anything.
- *Lesson:* Adding persistence made the application feel much closer to a production-style workflow instead of a temporary calculation tool.
