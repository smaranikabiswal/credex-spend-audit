const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json()); 

app.get('/api/health', (req, res) => {
    res.json({ status: "Backend engine is running smoothly" });
});

app.post('/api/audit', (req, res) => {
    const { tools } = req.body;

    if (!tools || !Array.isArray(tools) || tools.length === 0) {
        return res.status(400).json({ error: "No tool data received by the server." });
    }

    console.log("📥 Received SaaS Payload for Auditing:", tools);

   
    let totalCost = 0;
    tools.forEach(t => totalCost += t.cost);

    
    res.json({
        success: true,
        message: "Backend successfully parsed asset matrix.",
        summary: {
            totalTools: tools.length,
            monthlySpend: totalCost,
            status: "Pending AI layer optimization analysis on Day 4."
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Audit backend server spinning on port ${PORT}`);
});