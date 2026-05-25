let costChartInstance = null;

const toolsContainer = document.getElementById('tools-container');
const addToolBtn = document.getElementById('add-tool-btn');
const auditBtn = document.getElementById('audit-btn');

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

auditBtn.addEventListener('click', async () => {
    const rows = document.querySelectorAll('.tool-row');
    const payload = [];
    let calculatedTotalSpend = 0;

    rows.forEach(row => {
        const tool = row.querySelector('.tool-select').value;
        const plan = row.querySelector('.plan-select').value;
        const seats = row.querySelector('.seats-input').value;
        const cost = row.querySelector('.cost-input').value;

        if (tool && plan) {
            const parsedCost = parseFloat(cost) || 0;
            calculatedTotalSpend += parsedCost;
            
            payload.push({ 
                tool, 
                plan, 
                seats: parseInt(seats) || 0, 
                cost: parsedCost 
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
    auditResultsDiv.innerHTML = `<p style="color: #a78bfa;">🔄 Sending asset matrix to Express server and processing Gemini AI audit...</p>`;

    try {
        const response = await fetch('http://localhost:5000/api/audit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                tools: payload,
                totalSpend: calculatedTotalSpend
            }) 
        });

        const data = await response.json();

        if (data.success) {
            auditResultsDiv.innerHTML = `
                <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h3 style="color: #a78bfa; margin-bottom: 10px;">📊 Server Audit Complete</h3>
                    <p>Total Tools Evaluated: <strong>${payload.length}</strong></p>
                    <p>Aggregated Monthly Spend: <strong>$${calculatedTotalSpend.toFixed(2)}</strong></p>
                    <p>Optimized Recommended Spend: <strong style="color: #2ec4b6;">$${data.optimizedTotal.toFixed(2)}</strong></p>
                </div>
                <div class="chart-container">
                    <canvas id="costChart"></canvas>
                </div>
            `;

            document.getElementById('executive-summary-text').innerText = data.executiveSummary;

            const redundanciesList = document.getElementById('redundancies-list');
            redundanciesList.innerHTML = '';
            if (!data.redundancies || data.redundancies.length === 0) {
                redundanciesList.innerHTML = "<li>No critical tool overlaps or subscription inefficiencies flagged.</li>";
            } else {
                data.redundancies.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${item.tool}:</strong> ${item.issue} <br><em style="color: #cbd5e1;">Recommendation: ${item.recommendation}</em>`;
                    redundanciesList.appendChild(li);
                });
            }

            const alternativesList = document.getElementById('ai-alternatives-list');
            alternativesList.innerHTML = '';
            if (!data.aiAlternatives || data.aiAlternatives.length === 0) {
                alternativesList.innerHTML = "<li>Your current stack choices run effectively without cheaper deployment alternatives.</li>";
            } else {
                data.aiAlternatives.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${item.tool} ➡️ ${item.alternative}:</strong> ${item.reason} <span style="color: #2ec4b6;">(Saves ~$${item.savings}/mo)</span>`;
                    alternativesList.appendChild(li);
                });
            }

           
            renderCostChart(calculatedTotalSpend, data.optimizedTotal);

        } else {
            auditResultsDiv.innerHTML = `<p style="color: #ff6b6b;">❌ Server Error: ${data.error}</p>`;
        }

    } catch (error) {
        console.error("Fetch error:", error);
        auditResultsDiv.innerHTML = `<p style="color: #ff6b6b;">❌ Could not connect to the backend server. Make sure node server.js is running on Port 5000!</p>`;
    }
});

function renderCostChart(originalTotal, optimizedTotal) {
    const canvasElement = document.getElementById('costChart');
    if (!canvasElement) {
        console.error("Canvas element 'costChart' not found in DOM.");
        return;
    }
    
    const ctx = canvasElement.getContext('2d');

    if (costChartInstance) {
        costChartInstance.destroy();
    }

    costChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Current Monthly Spend', 'Optimized AI Spend'],
            datasets: [{
                label: 'Cost Comparison ($)',
                data: [originalTotal, optimizedTotal],
                backgroundColor: ['#ff4d4d', '#2ec4b6'], 
                borderWidth: 1,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#ffffff' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#ffffff' }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

document.getElementById('btn-export').addEventListener('click', () => {
    window.print();
});