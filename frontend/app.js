const toolsContainer = document.getElementById('tools-container');
const addToolBtn = document.getElementById('add-tool-btn');

addToolBtn.addEventListener('click', () => {

    const toolRow = document.createElement('div');

    toolRow.classList.add('tool-row');

    toolRow.innerHTML = `
    
        <div class="field">
            <label>Tool</label>
            <select class="tool-select">
                <option value="">Select Tool</option>
                <option>ChatGPT</option>
                <option>Claude</option>
                <option>Cursor</option>
                <option>Gemini</option>
                <option>Perplexity</option>
                <option>Midjourney</option>
            </select>
        </div>

        <div class="field">
            <label>Plan</label>
            <select class="plan-select">
                <option value="">Select Plan</option>
                <option>Free</option>
                <option>Pro</option>
                <option>Team</option>
                <option>Business</option>
                <option>Enterprise</option>
            </select>
        </div>

        <div class="field">
            <label>Seats</label>
            <input type="number" class="seats-input" placeholder="5" />
        </div>

        <div class="field">
            <label>Monthly Cost ($)</label>
            <input type="number" class="cost-input" placeholder="200" />
        </div>

        <button class="remove-btn">✕</button>
    `;

    toolsContainer.appendChild(toolRow);

});


toolsContainer.addEventListener('click', (e) => {

    if (e.target.classList.contains('remove-btn')) {

        const rows = document.querySelectorAll('.tool-row');

       
        if (rows.length > 1) {

            e.target.closest('.tool-row').remove();

        }

    }

});

document.getElementById('audit-btn').addEventListener('click', async () => {
    const rows = document.querySelectorAll('.tool-row');
    const payload = [];

    rows.forEach(row => {
        const tool = row.querySelector('.tool-select').value;
        const plan = row.querySelector('.plan-select').value;
        const seats = row.querySelector('.seats-input').value;
        const cost = row.querySelector('.cost-input').value;

        if (tool && plan) {
            payload.push({ 
                tool, 
                plan, 
                seats: parseInt(seats) || 0, 
                cost: parseFloat(cost) || 0 
            });
        }
    });

    if (payload.length === 0) {
        alert("Please select at least one tool and plan to run the audit.");
        return;
    }

    const resultsCard = document.getElementById('results-card');
    const auditResultsDiv = document.getElementById('audit-results');

    
    resultsCard.classList.remove('hidden');
    resultsCard.scrollIntoView({ behavior: 'smooth' });
    auditResultsDiv.innerHTML = `<p style="color: #a78bfa;">🔄 Sending asset matrix to Express server...</p>`;

    try {
       
        const response = await fetch('http://localhost:5000/api/audit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tools: payload }) 
        });

        const data = await response.json();

        if (data.success) {
         
            auditResultsDiv.innerHTML = `
                <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h3 style="color: #a78bfa; margin-bottom: 10px;">📊 Server Audit Complete</h3>
                    <p>Total Tools Evaluated: <strong>${data.summary.totalTools}</strong></p>
                    <p>Aggregated Monthly Spend: <strong>$${data.summary.monthlySpend.toFixed(2)}</strong></p>
                    <p style="margin-top: 10px; font-size: 0.9rem; color: #9ca3af;">🛠️ Server Status message: <em>"${data.summary.status}"</em></p>
                </div>
            `;
        } else {
            auditResultsDiv.innerHTML = `<p style="color: #ff6b6b;">❌ Server Error: ${data.error}</p>`;
        }

    } catch (error) {
        console.error("Fetch error:", error);
        auditResultsDiv.innerHTML = `<p style="color: #ff6b6b;">❌ Could not connect to the backend server. Make sure node server.js is running!</p>`;
    }
});