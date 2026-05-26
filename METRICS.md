# METRICS.md

## North Star Metric

**Qualified leads generated per week** — defined as email captures from users whose audit showed ≥$200/month in potential savings.

**Why this metric and not others:**
- "Total audits completed" is vanity — someone who saves $5/mo is not a Credex customer
- "Total email captures" overcounts low-value leads who clicked the notify button with no savings
- "Consultations booked" is too far down the funnel to optimize early — too few data points per week
- Qualified leads (≥$200 savings threshold) are the users who are both in pain and have budget — the exact Credex ICP

**Target at Week 4 post-launch:** 10 qualified leads/week

---

## 3 Input Metrics That Drive the North Star

**1. Audit completion rate** (completed audits / visitors who started filling the form)
- Current benchmark target: ≥40%
- Why it matters: If people start the form and abandon, the tool isn't earning trust fast enough. Low completion = unclear value proposition or form friction.
- What to do if low: Reduce form fields, add inline "why we ask this" microcopy, show a progress indicator.

**2. High-savings audit rate** (audits showing ≥$200 savings / total audits completed)
- Target: ≥25%
- Why it matters: This is determined partly by the audit logic quality and partly by whether we're reaching the right users. If this is low, either the audit logic is too conservative, or we're reaching solo devs with $20/mo spend instead of engineering managers with $500/mo spend.
- What to do if low: Sharpen distribution targeting toward team leads, not individual developers.

**3. Lead gate conversion rate** (email captures / audits showing ≥$200 savings)
- Target: ≥30%
- Why it matters: Users who see significant savings and still don't give their email are telling us something — either the lead gate is too aggressive, the trust isn't established, or the CTA copy isn't matching their intent.
- What to do if low: A/B test the CTA copy, test positioning the email gate as "get this emailed to you" rather than "sign up."

---

## What to Instrument First

In priority order:

1. **Audit completion event** — fire when user clicks "Run Audit" with a valid payload. This is the primary funnel event.
2. **Savings bucket distribution** — log which savings bucket each completed audit falls into (<$100, $100–$500, >$500). This tells us if we're reaching the right users.
3. **Lead capture conversion** — log when email form is submitted successfully vs shown but not submitted.
4. **Share link clicks** — log when the "Copy Share Link" button is clicked. Early signal of viral coefficient.
5. **Time to complete form** — if median time is >5 minutes, the form has friction worth fixing.

Simple implementation: custom events to a free Posthog or Mixpanel instance. No need for GA4 complexity at this stage.

---

## Pivot Trigger

**If, after 500 completed audits, fewer than 5% show ≥$200 in savings potential**, the audit logic is either too conservative or we're reaching users without enough AI spend to be meaningful leads for Credex.

In that case, the pivot decision is: shift targeting explicitly toward teams (not individuals), add a "team size" filter to the distribution channels, and increase the audit engine's sensitivity for multi-tool redundancy detection.

The tool's value to Credex is zero if it generates leads with no savings — those users have no reason to buy credits.