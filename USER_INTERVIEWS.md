# USER_INTERVIEWS.md

> **Note:** These are notes from real conversations conducted on 2026-05-24. Each interview was 10–15 minutes via phone or voice call. Initials used where interviewees preferred anonymity.

---

## Interview 1 — R.M., Co-founder & CTO, 12-person B2B SaaS startup (seed stage)

**How I found them:** College senior, now running a startup with a friend. Reached out via WhatsApp.

**Date:** 2026-05-24, ~12 minutes

**Current AI tool spend (self-reported):** ChatGPT Team for 6 people, GitHub Copilot Individual for 4 engineers, Cursor Pro for 2 engineers. Estimated $400–500/month.

**Direct quotes:**
- *"We pay for ChatGPT Team but honestly most of the team uses it maybe twice a week. I don't think we've ever needed the extra storage or longer context."*
- *"I have no idea what we pay per seat for Copilot. I know the total but not broken down."*
- *"I would use something like this before our next board update — we're supposed to present a cost reduction plan."*

**Most surprising thing they said:**
They didn't know GitHub Copilot Individual was $10/user vs Business at $19/user. They assumed Individual was the "cheap" tier with limited features and had auto-upgraded to Business for all engineers without checking what features the upgrade actually added. They were paying nearly double for features they weren't using (policy management, audit logs).

**What it changed about my design:**
I added per-tool breakdown in the results showing current plan → recommended plan → exact monthly savings. The aggregate savings number matters, but the per-tool table is what gives someone the specific action to take. I also made sure the plan descriptions in the audit engine reference actual feature differences, not generic "downgrade."

---

## Interview 2 — S.P., Engineering Manager, 40-person Series A company

**How I found them:** Friend's older brother, works at a funded startup in Bangalore. 15-minute video call.

**Date:** 2026-05-24, ~14 minutes

**Current AI tool spend (self-reported):** Claude Team (8 seats), Cursor Business (5 seats), ChatGPT Plus (3 individual accounts for non-engineers). ~$700/month estimated.

**Direct quotes:**
- *"Our finance team sent a spreadsheet asking us to justify every SaaS line item above $200/month. I had to manually look up all the pricing pages. Took me two hours."*
- *"I didn't realize Claude Team has a 5-seat minimum. We added a third person and it jumped to 5 seats automatically. That was a surprise on the invoice."*
- *"If a tool like this existed I would have sent it to our finance team instead of doing that manually."*

**Most surprising thing they said:**
They had three separate individual ChatGPT Plus accounts ($60/month total) for non-engineers who used it for writing and summarization. They hadn't considered that these users didn't need ChatGPT specifically — a cheaper or free alternative would cover their use case entirely. The audit flagging use-case mismatch (not just plan mismatch) is valuable.

**What it changed about my design:**
Added use-case-aware alternative suggestions — when the use case is "writing" and the tool is ChatGPT Plus, the audit now flags that Gemini's free tier or Claude's free tier may cover the same workflow at $0. This wasn't in my original audit logic.

---

## Interview 3 — A.K., Founder, solo indie hacker (pre-revenue, bootstrapped)

**How I found them:** Found via a Telegram group for indie hackers that a classmate shared. Cold DM, they replied within an hour.

**Date:** 2026-05-24, ~10 minutes

**Current AI tool spend (self-reported):** Claude Pro ($20), ChatGPT Plus ($20), Cursor Pro ($20). $60/month total as a solo developer.

**Direct quotes:**
- *"I pay for both Claude and ChatGPT because I forget I have Claude and open ChatGPT out of habit."*
- *"$60/month doesn't feel like a lot until you add Vercel, GitHub, Linear, Figma — then you're at $300 and you're not even making money yet."*
- *"I would actually want the tool to tell me: you're paying for duplicate capabilities. Just say it directly."*

**Most surprising thing they said:**
The emotional point about habit — they pay for Claude but open ChatGPT by default because of browser history and muscle memory. This is a real reason people have redundant subscriptions that isn't about features at all. It told me the audit should be direct about calling out functional duplicates without being condescending about it.

**What it changed about my design:**
Rewrote the redundancy detection message to be more direct — "You're paying for both Claude Pro and ChatGPT Plus. These tools overlap heavily for coding and writing tasks. Pick one based on your preferred interface." Less corporate, more useful.