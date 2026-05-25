import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('📦 MongoDB Actively Connected!'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

const auditSchema = new mongoose.Schema({
    totalSpend: Number,
    optimizedTotal: Number,
    tools: Array,
    executiveSummary: String,
    redundancies: Array,
    aiAlternatives: Array,
    createdAt: { type: Date, default: Date.now }
});

const AuditReport = mongoose.model('AuditReport', auditSchema);


app.post('/api/audit', async (req, res) => {
    try {
        const { tools, totalSpend } = req.body;

        if (!tools || tools.length === 0) {
            return res.status(400).json({ error: "No tools provided for auditing." });
        }

        const prompt = `
            You are a forensic SaaS financial controller. Inspect this tool inventory for spending leakage.
            
            Current Monthly Budget: $${totalSpend}
            Inventory Payload: ${JSON.stringify(tools)}

            Perform a two-stage deep-dive financial audit:
            1. Identify EXACTLY where money is being wasted (over-allocated seats, plan mismatches, feature duplication).
            2. Provide a tactical, step-by-step reduction roadmap explaining exactly HOW to claw back that waste.

            Return your complete response matching this precise JSON schema structure:
            {
                "optimizedTotal": 70,
                "executiveSummary": "A concise paragraph summarizing major areas of waste, tool overlaps, and strategic shifts.",
                "redundancies": [
                    { "tool": "Tool Name", "issue": "Detailed reason why money is wasted here", "recommendation": "Exact instruction to consolidate or downgrade" }
                ],
                "aiAlternatives": [
                    { "tool": "Current Tool", "alternative": "Recommended AI Alternative", "reason": "Why it is better or cheaper", "savings": 45 }
                ]
            }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const auditResult = JSON.parse(response.text);

       
        const savedAudit = await AuditReport.create({
            totalSpend,
            tools,
            optimizedTotal: auditResult.optimizedTotal,
            executiveSummary: auditResult.executiveSummary,
            redundancies: auditResult.redundancies,
            aiAlternatives: auditResult.aiAlternatives
        });

       
        res.json({
            success: true,
            auditId: savedAudit._id, 
            ...auditResult
        });

    } catch (error) {
        console.error("Gemini/DB Error:", error);
        res.status(500).json({ error: "Failed to process AI audit report." });
    }
});
