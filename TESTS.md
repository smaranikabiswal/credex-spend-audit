# TESTS.md

## How to Run Tests

```bash
cd backend
node --test audit.test.js
```

Requires Node.js 18+. All tests use the built-in `node:test` and `node:assert` modules — no additional dependencies.

---

## Test Coverage

### File: `backend/audit.test.js`

| Test | What It Covers | Expected Result |
|---|---|---|
| Test 1: Single tool optimization math | A single ChatGPT Plus at $20/mo should optimize to $14 after 30% credit discount | `strictEqual(result, 14)` |
| Test 2: Multiple tool aggregation | Two tools at $20/mo each should aggregate correctly to $28 optimized | `strictEqual(result, 28)` |
| Test 3: Zero cost handling | A tool with $0 cost should return $0 optimized — no negative or NaN values | `strictEqual(result, 0)` |
| Test 4: Claude Team under-seat penalty | Claude Team plan with only 2 seats (below minimum 5) should result in lower optimized cost than original | `ok(result < 60)` |
| Test 5: Unknown tool graceful handling | A tool not in the mapping should still process without throwing, applying base discount | `strictEqual(result, 70)` |

---

## CI

Tests run automatically on every push to `main` via `.github/workflows/ci.yml`.

Green check visible on latest commit at: https://github.com/smaranikabiswal/credex-spend-audit/actions

---

## Known Test Gaps

The current tests cover the deterministic math layer only. The following are not yet covered by automated tests and are manually tested:

- MongoDB write/read round-trip for AuditReport
- Gemini API fallback behaviour when API key is invalid
- Lead capture form validation
- Share link rendering (read-only view mode)

These would be covered in Week 2 using a test database and API mocking with `nock`.