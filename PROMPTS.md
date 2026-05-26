# PROMPTS.md

## Production Prompt (Used in server.js)

```
Analyze this startup software infrastructure stack. 
Team Size: ${teamSize}, Core Focus Track: ${useCase}. 
Current Monthly SaaS Overhead Spend: $${totalSpend}, 
Suggested Optimized Baseline: $${optimizedTotal}. 
System overlaps discovered: ${JSON.stringify(redundancies)}. 

Write a precise 100-word strategic advisory briefing summary highlighting 
immediate consolidation paths. Maintain an executive corporate voice. 
Do not include markdown headers, bullet points, or list formatting. 
Write in flowing prose only.
```

## Why I Wrote It This Way

**Structured inputs, not free-form:** I pass in exact numbers ($totalSpend, $optimizedTotal, teamSize) rather than asking the model to calculate anything. The assignment explicitly says "for the audit math itself, hardcoded rules are correct — knowing when not to use AI is part of the test." The LLM is only responsible for narrative framing, not arithmetic.

**100-word constraint:** Without a word limit the model tends to write 300+ word essays. The results page needs a scannable paragraph, not a report. The constraint forces conciseness.

**"No markdown" instruction:** Early versions returned bullet points and headers which broke the UI rendering. Explicit instruction to write in flowing prose fixed this.

**Executive voice instruction:** Without this, the model defaulted to casual language ("you might want to think about..."). The target user is a CTO or engineering manager — the tone should match.

---

## What I Tried That Didn't Work

**Version 1 — asked the model to identify savings:**
```
Given these tools: ${JSON.stringify(tools)}, identify where this team is overspending.
```
Problem: The model invented savings numbers that didn't match the deterministic calculation. A user would see "$340 savings" in the hero and "$280 savings" in the AI summary — inconsistent and untrustworthy.

**Version 2 — too long, no constraint:**
```
Write a detailed analysis of this company's AI tool spending...
```
Problem: Returned 400-word responses that overflowed the UI card and took 3+ seconds to generate.

**Version 3 — asked for bullet points:**
```
List the top 3 recommendations for this team's AI stack.
```
Problem: Bullets rendered as literal asterisks in the `<p>` tag. Fixed by switching to prose instruction, but the real fix was Version 4 (the production prompt above).

---

## Fallback Template

When the Gemini API is unavailable, the backend returns:

```
Your development cluster currently presents an allocation profile spending 
$${totalSpend}/mo across ${tools.length} active instances. Based on your 
target execution parameters for ${useCase} workloads with a headcount 
baseline of ${teamSize}, consolidating your system architecture onto 
dedicated environments lowers your predictable operational spend floor 
to an estimated $${optimizedTotal}/mo.
```

This always works, always has the right numbers, and is honest about being a template rather than an AI-generated insight.