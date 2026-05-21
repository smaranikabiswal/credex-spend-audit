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
