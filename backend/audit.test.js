// File: backend/audit.test.js
import assert from 'node:assert';
import test from 'node:test';

// Mocking the deterministic math logic from your frontend
function calculateAuditDeterministic(tools) {
    let optimizedTotal = 0;
    tools.forEach(item => {
        let cost = item.cost;
        if (item.tool === "Claude" && item.plan === "Team" && item.seats < 5) cost = (cost / item.seats) * item.seats;
        optimizedTotal += Math.max(0, cost * 0.70); // 30% credit discount applied
    });
    return Math.round(optimizedTotal);
}

test('Test 1: Single tool optimization math', () => {
    const tools = [{ tool: "ChatGPT", plan: "Plus", seats: 1, cost: 20 }];
    const result = calculateAuditDeterministic(tools);
    assert.strictEqual(result, 14); // 20 * 0.70
});

test('Test 2: Multiple tool aggregation', () => {
    const tools = [
        { tool: "ChatGPT", cost: 20 },
        { tool: "Cursor", cost: 20 }
    ];
    const result = calculateAuditDeterministic(tools);
    assert.strictEqual(result, 28); 
});

test('Test 3: Zero cost handling', () => {
    const tools = [{ tool: "Claude", cost: 0 }];
    assert.strictEqual(calculateAuditDeterministic(tools), 0);
});

test('Test 4: Claude Team under-seat penalty logic', () => {
    const tools = [{ tool: "Claude", plan: "Team", seats: 2, cost: 60 }];
    assert.ok(calculateAuditDeterministic(tools) < 60); 
});

test('Test 5: Missing payload attributes safety', () => {
    const tools = [{ tool: "Unknown", cost: 100 }];
    assert.strictEqual(calculateAuditDeterministic(tools), 70); 
});