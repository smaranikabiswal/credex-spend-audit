# REFLECTION.md

## 1. The Hardest Bug

The hardest bug was the first-row desync issue on the tool form. The initial HTML had a hardcoded `<div class="tool-row">` with static `<option>` tags listing tools. My JavaScript had a separate `toolPlanMapping` object that drove dynamic plan population when a tool was selected. The problem: the hardcoded row's tool `<select>` never triggered the plan-population logic because the `change` event listener was only attached inside `createToolRow()`, which wasn't called for the static row.

My first hypothesis was that the event listener was being attached before the DOM element existed — a timing issue. I added `DOMContentLoaded` wrapping and tested. No change. Then I noticed the plan dropdown on the first row always showed all generic options (Free, Pro, Team, Business, Enterprise) while dynamically added rows showed tool-specific plans like "Hobby / Pro / Business / Enterprise" for Cursor. That told me the problem wasn't timing — it was that the first row was never wired to the `toolPlanMapping` system at all.

The fix was simple once I understood it: delete the hardcoded HTML row entirely and call `createToolRow()` on page load. One function, one code path, consistent behaviour. The lesson: having two ways to create the same UI element is always a bug waiting to happen.

---

## 2. A Decision I Reversed

I initially planned to use the Anthropic API for the AI summary because the assignment listed it as "preferred." I set up the API call, got it working, then realized: the Anthropic API requires a paid account with credits. Any reviewer trying to run this locally would hit an auth error immediately and see a broken feature.

I reversed this on Day 2 and switched to Gemini 2.5 Flash, which has a genuinely free tier accessible via API key with no credit card. The prompt produces nearly identical quality output. I documented the decision in ARCHITECTURE.md. The assignment says "preferred" not "required," and a tool that works for the reviewer is better than a tool that demonstrates a preferred technology but breaks on first run.

---

## 3. What I Would Build in Week 2

Three things, in priority order:

**Real transactional email via Resend.** Right now the lead capture stores the email and logs a stub. The assignment requires an actual confirmation email. This was the one MVP feature I didn't fully ship and I'd fix it first — it's a 2-hour task with the Resend free tier.

**Per-tool spend breakdown in the results.** Right now the results show aggregate savings. A table showing Tool | Current Plan | Current Cost | Recommended Action | Monthly Savings per row would make the audit dramatically more actionable and more likely to be screenshotted and shared.

**Benchmark mode.** "Your AI spend per developer is $X — companies your size average $Y." This requires collecting enough audit data to build a real benchmark, which takes time, but even a mocked version with reasonable estimates would be compelling. It's also the strongest viral hook — people share comparisons.

---

## 4. How I Used AI Tools

I used Claude (claude.ai) throughout the week. Specifically:

- **Generating boilerplate** — the Express route structure, MongoDB schema syntax, Chart.js configuration. I used Claude to get a working skeleton fast, then rewrote it to match my actual data model.
- **Debugging** — pasting error messages and asking what was wrong. Claude was right about 70% of the time; the other 30% I had to trace through the actual code myself.
- **Writing** — first drafts of GTM.md and ECONOMICS.md. I used Claude to structure my thinking, then rewrote every section in my own words with my own numbers.

**What I didn't trust AI with:** The pricing data. I manually verified every number against official vendor pages because AI training data goes stale and a wrong price in PRICING_DATA.md would be an obvious credibility failure.

**One time AI was wrong:** I asked Claude to write the Gemini API response parsing code. It wrote `data.content[0].text` — which is the Anthropic API response format, not Gemini's. Gemini's format is `data.candidates[0].content.parts[0].text`. The code would have silently returned `undefined` and triggered the fallback every time. I caught it by testing the actual API response in Hoppscotch first.

---

## 5. Self-Rating

| Dimension | Score | Reason |
|---|---|---|
| Discipline | 7/10 | Committed 6 days with entries across all days, but Day 1 and 2 hours were lighter than they should have been. I underestimated how long pricing research would take. |
| Code quality | 6/10 | The audit logic is clean and testable. The frontend JavaScript has some long functions that should be broken up. No TypeScript — I chose JS for speed but the codebase would benefit from types on the audit data structures. |
| Design sense | 7/10 | Glassmorphism dark UI is visually clean and the results page is screenshot-worthy. The input form is functional but not beautiful — the tool rows feel a bit dense on mobile. |
| Problem solving | 7/10 | Found and fixed the first-row bug, the Gemini response parsing bug, and the Chart.js mobile collapse without getting stuck for long. Reversed the Anthropic API decision early rather than late. |
| Entrepreneurial thinking | 6/10 | GTM and ECONOMICS are grounded in real numbers, not vague TAM. User interviews happened and changed one design decision. I'd rate myself lower than a founder who'd actually launched something, but higher than someone who wrote generic marketing copy. |