let costChartInstance = null;

const toolsContainer = document.getElementById('tools-container');
const addToolBtn = document.getElementById('add-tool-btn');
const auditBtn = document.getElementById('audit-btn');
const teamSizeInput = document.getElementById('team-size-input');
const useCaseSelect = document.getElementById('use-case-select');

const toolPlanMapping = {
    "Cursor": ["Hobby", "Pro", "Business", "Enterprise"],
    "GitHub Copilot": ["Individual", "Business", "Enterprise"],
    "Claude": ["Free", "Pro", "Max", "Team", "Enterprise", "API direct"],
    "ChatGPT": ["Plus", "Team", "Enterprise", "API direct"],
    "Anthropic API direct": ["API direct"],
    "OpenAI API direct": ["API direct"],
    "Gemini": ["Pro", "Ultra", "API"],
    "Windsurf": ["Free", "Pro", "Enterprise"]
};

function calculateAuditDeterministic(tools, teamSize, useCase) {
    let optimizedTotal = 0;
    const redundancies = [];
    const aiAlternatives = [];

    tools.forEach(item => {
        let cost = item.cost;
        let seats = item.seats;
        let optimizedCost = cost;

        if (item.tool === "Claude" && item.plan === "Team" && seats < 5) {
            optimizedCost = (cost / seats) * seats; 
            redundancies.push({
                tool: "Claude",
                issue: "Using a Team tier plan for a very small seat count footprint.",
                recommendation: "Downgrade to Claude Pro individual seats to preserve workspace capital."
            });
        }

        if (item.tool === "Cursor" && item.plan === "Business" && seats <= 2) {
            optimizedCost = 20 * seats;
            redundancies.push({
                tool: "Cursor",
                issue: "Corporate enterprise features are underutilized at this team volume.",
                recommendation: "Consolidate active developers onto the standalone Pro tier."
            });
        }

        if ((item.tool === "ChatGPT" || item.tool === "Claude") && useCase === "coding") {
            let savingsPotential = cost * 0.4;
            aiAlternatives.push({
                tool: item.tool,
                alternative: "Cursor / GitHub Copilot",
                reason: "Dedicated IDE context extensions deliver higher efficiency loops for pure engineering tracks.",
                savings: savingsPotential
            });
            optimizedCost -= savingsPotential;
        }

        if (cost > 0) {
            let creditDiscountCost = optimizedCost * 0.70; 
            aiAlternatives.push({
                tool: item.tool,
                alternative: "Credex Infrastructure Credits",
                reason: "Sourcing matching system licenses through liquidated high-volume corporate allocations.",
                savings: optimizedCost - creditDiscountCost
            });
            optimizedCost = creditDiscountCost;
        }

        optimizedTotal += Math.max(0, optimizedCost);
    });

    return {
        optimizedTotal: Math.round(optimizedTotal),
        redundancies,
        aiAlternatives: aiAlternatives.map(a => ({ ...a, savings: Math.round(a.savings) }))
    };
}

function saveFormState() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auditId')) return;

    const rows = document.querySelectorAll('.tool-row');
    const toolsState = [];
    
    rows.forEach(row => {
        toolsState.push({
            tool: row.querySelector('.tool-select').value,
            plan: row.querySelector('.plan-select').value,
            seats: row.querySelector('.seats-input').value,
            cost: row.querySelector('.cost-input').value
        });
    });

    const fullState = {
        teamSize: teamSizeInput ? teamSizeInput.value : '',
        useCase: useCaseSelect ? useCaseSelect.value : '',
        tools: toolsState
    };

    localStorage.setItem('credexFormState', JSON.stringify(fullState));
}

async function loadInitialApplicationState() {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedAuditId = urlParams.get('auditId');

    if (sharedAuditId) {
        document.getElementById('input-card-container')?.classList.add('hidden');
        await renderSharedAuditView(sharedAuditId);
    } else {
        const saved = localStorage.getItem('credexFormState');
        if (!saved) {
            createToolRow();
            return;
        }
        
        const state = JSON.parse(saved);
        if (teamSizeInput && state.teamSize) teamSizeInput.value = state.teamSize;
        if (useCaseSelect && state.useCase) useCaseSelect.value = state.useCase;
        
        if (state.tools && state.tools.length > 0) {
            toolsContainer.innerHTML = '';
            state.tools.forEach(item => {
                createToolRow(item);
            });
        } else {
            createToolRow();
        }
    }
}

function createToolRow(data = { tool: '', plan: '', seats: '', cost: '' }) {
    const toolRow = document.createElement('div');
    toolRow.classList.add('tool-row');

    toolRow.innerHTML = `
        <div class="field">
            <label>Tool</label>
            <select class="tool-select">
                <option value="">Select Tool</option>
                ${Object.keys(toolPlanMapping).map(t => `<option value="${t}" ${data.tool === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
        </div>

        <div class="field">
            <label>Plan</label>
            <select class="plan-select">
                <option value="">Select Plan</option>
            </select>
        </div>

        <div class="field">
            <label>Seats</label>
            <input type="number" class="seats-input" placeholder="5" value="${data.seats}" />
        </div>

        <div class="field">
            <label>Monthly Cost ($)</label>
            <input type="number" class="cost-input" placeholder="200" value="${data.cost}" />
        </div>

        <button class="remove-btn">✕</button>
    `;

    const toolSelect = toolRow.querySelector('.tool-select');
    const planSelect = toolRow.querySelector('.plan-select');

    const populatePlans = (selectedTool, selectedPlan = '') => {
        planSelect.innerHTML = '<option value="">Select Plan</option>';
        if (toolPlanMapping[selectedTool]) {
            toolPlanMapping[selectedTool].forEach(plan => {
                const isSelected = plan === selectedPlan ? 'selected' : '';
                planSelect.innerHTML += `<option value="${plan}" ${isSelected}>${plan}</option>`;
            });
        }
    };

    if (data.tool) {
        populatePlans(data.tool, data.plan);
    }

    toolSelect.addEventListener('change', (e) => {
        populatePlans(e.target.value);
        saveFormState();
    });

    planSelect.addEventListener('change', saveFormState);
    toolRow.querySelector('.seats-input').addEventListener('input', saveFormState);
    toolRow.querySelector('.cost-input').addEventListener('input', saveFormState);

    toolsContainer.appendChild(toolRow);
}

addToolBtn.addEventListener('click', () => {
    createToolRow();
    saveFormState();
});

toolsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
        const rows = document.querySelectorAll('.tool-row');
        if (rows.length > 1) {
            e.target.closest('.tool-row').remove();
            saveFormState();
        }
    }
});

if (teamSizeInput) teamSizeInput.addEventListener('input', saveFormState);
if (useCaseSelect) useCaseSelect.addEventListener('change', saveFormState);

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

    const currentTeamSize = teamSizeInput ? parseInt(teamSizeInput.value) || 1 : 1;
    const currentUseCase = useCaseSelect ? useCaseSelect.value : 'mixed';

    const localCalculations = calculateAuditDeterministic(payload, currentTeamSize, currentUseCase);

    const resultsCard = document.getElementById('results-card');
    const auditResultsDiv = document.getElementById('audit-results');

    resultsCard.classList.remove('hidden');
    resultsCard.scrollIntoView({ behavior: 'smooth' });
    auditResultsDiv.innerHTML = `<p style="color: #a78bfa;">🔄 Syncing local asset matrix and processing personalized summary via Gemini API...</p>`;

    try {
        const response = await fetch('/api/audit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                tools: payload,
                totalSpend: calculatedTotalSpend,
                teamSize: currentTeamSize,
                useCase: currentUseCase,
                optimizedTotal: localCalculations.optimizedTotal,
                redundancies: localCalculations.redundancies,
                aiAlternatives: localCalculations.aiAlternatives
            }) 
        });

        const data = await response.json();

        if (data.success) {
            window.history.pushState({}, '', `?auditId=${data.auditId}`);
            renderUIComponents(calculatedTotalSpend, data.optimizedTotal, data.executiveSummary, data.redundancies, data.aiAlternatives, data.auditId);
        } else {
            auditResultsDiv.innerHTML = `<p style="color: #ff6b6b;">❌ Server Error: ${data.error}</p>`;
        }

    } catch (error) {
        console.error("Fetch error:", error);
        auditResultsDiv.innerHTML = `<p style="color: #ff6b6b;">❌ Connection failed. Rendering calculations using local safety fallback...</p>`;
        renderUIComponents(calculatedTotalSpend, localCalculations.optimizedTotal, "Calculations generated locally due to service disconnection fallback protocols.", localCalculations.redundancies, localCalculations.aiAlternatives, null);
    }
});

async function renderSharedAuditView(auditId) {
    const resultsCard = document.getElementById('results-card');
    const auditResultsDiv = document.getElementById('audit-results');
    
    resultsCard.classList.remove('hidden');
    auditResultsDiv.innerHTML = `<p style="color: #a78bfa;">🔄 Retrieving shared ecosystem audit report link parameters...</p>`;

    try {
        const response = await fetch(`/api/audit/${auditId}`);
        const data = await response.json();

        if (data.success) {
            renderUIComponents(data.totalSpend, data.optimizedTotal, data.executiveSummary, data.redundancies, data.aiAlternatives, auditId, true);
        } else {
            auditResultsDiv.innerHTML = `<p style="color: #ff6b6b;">❌ Shared Audit link invalid or asset configuration expired.</p>`;
        }
    } catch (err) {
        auditResultsDiv.innerHTML = `<p style="color: #ff6b6b;">❌ Failed to load shared matrix environment.</p>`;
    }
}

function renderUIComponents(originalTotal, optimizedTotal, executiveSummary, redundancies, aiAlternatives, auditId, isReadOnlyView = false) {
    const auditResultsDiv = document.getElementById('audit-results');
    const resultsCard = document.getElementById('results-card');
    
    const absoluteMonthlySavings = originalTotal - optimizedTotal;
    const absoluteAnnualSavings = absoluteMonthlySavings * 12;
    
    auditResultsDiv.innerHTML = `
        <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); padding: 20px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
            <h2 style="color: #a78bfa; margin-bottom: 5px; font-size: 2.2rem;">💰 Est. Monthly Savings: $${absoluteMonthlySavings.toFixed(2)}</h2>
            <h3 style="color: #2ec4b6; margin-top: 0; font-size: 1.6rem; margin-bottom: 20px;">📅 Est. Annual Savings: $${absoluteAnnualSavings.toFixed(2)}</h3>
            <div style="text-align: left; max-width: 400px; margin: 0 auto; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
                <p>Aggregated Monthly Spend: <strong>$${originalTotal.toFixed(2)}</strong></p>
                <p>Optimized Recommended Spend: <strong style="color: #2ec4b6;">$${optimizedTotal.toFixed(2)}</strong></p>
            </div>
            ${auditId ? `<button id="btn-copy-share" class="action-btn" style="margin-top: 15px; background: rgba(139, 92, 246, 0.2); color: #a78bfa; border: 1px solid #8b5cf6; padding: 8px 16px; border-radius: 6px; cursor: pointer;">📋 Copy Unique Share Link</button>` : ''}
        </div>
        <div class="chart-container">
            <canvas id="costChart"></canvas>
        </div>
    `;

    if (auditId) {
        document.getElementById('btn-copy-share').addEventListener('click', () => {
            const shareUrl = `${window.location.origin}${window.location.pathname}?auditId=${auditId}`;
            navigator.clipboard.writeText(shareUrl);
            alert("Shareable link captured directly to your clipboard!");
        });
    }

    document.getElementById('executive-summary-text').innerText = executiveSummary;

    const redundanciesList = document.getElementById('redundancies-list');
    redundanciesList.innerHTML = '';
    if (!redundancies || redundancies.length === 0) {
        redundanciesList.innerHTML = "<li>No critical tool overlaps or subscription inefficiencies flagged.</li>";
    } else {
        redundancies.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${item.tool}:</strong> ${item.issue} <br><em style="color: #cbd5e1;">Recommendation: ${item.recommendation}</em>`;
            redundanciesList.appendChild(li);
        });
    }

    const alternativesList = document.getElementById('ai-alternatives-list');
    alternativesList.innerHTML = '';
    if (!aiAlternatives || aiAlternatives.length === 0) {
        alternativesList.innerHTML = "<li>Your current stack choices run effectively without cheaper deployment alternatives.</li>";
    } else {
        aiAlternatives.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${item.tool} ➡️ ${item.alternative}:</strong> ${item.reason} <span style="color: #2ec4b6;">(Saves ~$${item.savings}/mo)</span>`;
            alternativesList.appendChild(li);
        });
    }

    renderCostChart(originalTotal, optimizedTotal);

    if (isReadOnlyView) return;

    const gatesContainer = document.getElementById('dynamic-gates-container') || document.createElement('div');
    gatesContainer.id = 'dynamic-gates-container';
    gatesContainer.style.marginTop = '20px';
    resultsCard.appendChild(gatesContainer);

    if (absoluteMonthlySavings > 500) {
        gatesContainer.innerHTML = `
            <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(46, 196, 182, 0.2)); border: 2px solid #8b5cf6; padding: 25px; border-radius: 12px; text-align: center;">
                <h3 style="color: #a78bfa; margin-top: 0;">💥 Prominent Credex Optimization Available</h3>
                <p style="font-size: 1.1rem;">You are losing over <strong>$${absoluteMonthlySavings.toFixed(2)}/mo</strong> on retail configurations. Secure your complete breakdown report and unlock immediate institutional credits route pricing by connecting with our consultation desk.</p>
                <form id="lead-capture-form" style="margin-top: 15px; display: flex; flex-direction: column; gap: 10px; align-items: center; max-width: 320px; margin-left: auto; margin-right: auto;">
                    <input type="email" id="gate-email" placeholder="Corporate Email (Required)" required style="padding: 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: #1e1b4b; color: white; width: 100%;" />
                    <input type="text" id="gate-company" placeholder="Company Name (Optional)" style="padding: 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); background: #1e1b4b; color: white; width: 100%;" />
                    <input type="text" id="gate-role" placeholder="Your Role (Optional)" style="padding: 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); background: #1e1b4b; color: white; width: 100%;" />
                    <button type="submit" id="gate-submit-btn" style="background: #2ec4b6; color: #0f172a; font-weight: bold; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; width: 100%; margin-top: 5px;">Book Credex Consultation & Save</button>
                </form>
            </div>
        `;
    } else if (absoluteMonthlySavings < 100) {
        gatesContainer.innerHTML = `
            <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255,255,255,0.1); padding: 25px; border-radius: 12px; text-align: center;">
                <h3 style="color: #2ec4b6; margin-top: 0;">✅ You're spending well.</h3>
                <p>Your current configuration architecture runs at optimal margins. We refuse to manufacture synthetic overspending indicators or arbitrary waste parameters.</p>
                <p style="color: #94a3b8; font-size: 0.95rem;">Drop your email to establish an active tracking baseline and get notified the second new optimization tiers match your stack layout:</p>
                <form id="lead-capture-form" style="margin-top: 15px; display: flex; flex-direction: column; gap: 10px; align-items: center; max-width: 320px; margin-left: auto; margin-right: auto;">
                    <input type="email" id="gate-email" placeholder="Corporate Email (Required)" required style="padding: 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: #1e1b4b; color: white; width: 100%;" />
                    <input type="text" id="gate-company" placeholder="Company Name (Optional)" style="padding: 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); background: #1e1b4b; color: white; width: 100%;" />
                    <input type="text" id="gate-role" placeholder="Your Role (Optional)" style="padding: 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); background: #1e1b4b; color: white; width: 100%;" />
                    <button type="submit" id="gate-submit-btn" style="background: rgba(255,255,255,0.1); color: white; padding: 12px 24px; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; cursor: pointer; width: 100%; margin-top: 5px;">Notify Me Of Optimizations</button>
                </form>
            </div>
        `;
    } else {
        gatesContainer.innerHTML = `
            <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255,255,255,0.1); padding: 25px; border-radius: 12px; text-align: center;">
                <h3 style="color: #a78bfa; margin-top: 0;">Lock In Your Optimization Strategy</h3>
                <p>Export your full personalized assessment mapping and historical trace report directly to your inbox.</p>
                <form id="lead-capture-form" style="margin-top: 15px; display: flex; flex-direction: column; gap: 10px; align-items: center; max-width: 320px; margin-left: auto; margin-right: auto;">
                    <input type="email" id="gate-email" placeholder="Work Email (Required)" required style="padding: 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: #1e1b4b; color: white; width: 100%;" />
                    <input type="text" id="gate-company" placeholder="Company Name (Optional)" style="padding: 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); background: #1e1b4b; color: white; width: 100%;" />
                    <input type="text" id="gate-role" placeholder="Your Role (Optional)" style="padding: 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); background: #1e1b4b; color: white; width: 100%;" />
                    <button type="submit" id="gate-submit-btn" style="background: #8b5cf6; color: white; font-weight: bold; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; width: 100%; margin-top: 5px;">Secure Report Artifact</button>
                </form>
            </div>
        `;
    }

    document.getElementById('lead-capture-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('gate-email').value;
        const company = document.getElementById('gate-company').value;
        const role = document.getElementById('gate-role').value;
        const btn = document.getElementById('gate-submit-btn');

        btn.innerText = "⏳ Transmission Secure...";
        btn.disabled = true;

        try {
            await fetch('/api/lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ auditId, email, company, role })
            });
            gatesContainer.innerHTML = `<p style="color: #2ec4b6; font-weight: bold; font-size: 1.1rem; text-align: center;">✅ Audit confirmation token transmitted successfully to ${email}!</p>`;
        } catch (err) {
            btn.innerText = "❌ Transaction Failed - Retry";
            btn.disabled = false;
        }
    });
}

function renderCostChart(originalTotal, optimizedTotal) {
    const canvasElement = document.getElementById('costChart');
    if (!canvasElement) return;
    
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

window.addEventListener('DOMContentLoaded', loadInitialApplicationState);