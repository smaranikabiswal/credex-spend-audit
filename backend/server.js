import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


const auditLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 30, 
    message: { error: "Too many optimization requests from this footprint. Rate safety triggered." }
});


app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Database connected successfully to Mongo cluster.'))
    .catch(err => console.error('Database terminal connection failure:', err));

const auditReportSchema = new mongoose.Schema({
    totalSpend: { type: Number, required: true },
    optimizedTotal: { type: Number, required: true },
    teamSize: { type: Number, required: true },
    useCase: { type: String, required: true },
    tools: [{
        tool: String,
        plan: String,
        seats: Number,
        cost: Number
    }],
    redundancies: [{
        tool: String,
        issue: String,
        recommendation: String
    }],
    aiAlternatives: [{
        tool: String,
        alternative: String,
        reason: String,
        savings: Number
    }],
    executiveSummary: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const leadSchema = new mongoose.Schema({
    email: { type: String, required: true, trim: true },
    company: { type: String, trim: true, default: '' },
    role: { type: String, trim: true, default: '' },
    auditId: { type: mongoose.Schema.Types.ObjectId, ref: 'AuditReport', required: true },
    capturedAt: { type: Date, default: Date.now }
});

const AuditReport = mongoose.model('AuditReport', auditReportSchema);
const Lead = mongoose.model('Lead', leadSchema);



app.post('/api/audit', auditLimiter, async (req, res) => {
    try {
        const { tools, totalSpend, teamSize, useCase, optimizedTotal, redundancies, aiAlternatives } = req.body;

        if (!tools || tools.length === 0) {
            return res.status(400).json({ success: false, error: "Ecosystem asset list matrix cannot be empty." });
        }

        let executiveSummary = "";
        const promptText = `Analyze this startup software infrastructure stack. Team Size: ${teamSize}, Core Focus Track: ${useCase}. Current Monthly SaaS Overhead Spend: $${totalSpend}, Suggested Programmatic Target Spend Optimized Baseline: $${optimizedTotal}. System overlaps discovered: ${JSON.stringify(redundancies)}. Write a precise 100-word strategic advisory briefing summary highlighting immediate consolidation paths. Maintain an executive corporate voice. Do not include markdown headers or list flags.`;

        try {
            if (!process.env.LLM_API_KEY) {
                throw new Error("Missing LLM service integration credential parameters.");
            }

            const llmResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.LLM_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }],
                    generationConfig: { maxOutputTokens: 200 }
                })
            });

            const llmData = await llmResponse.json();
            if (llmData.candidates && llmData.candidates[0].content.parts[0].text) {
                executiveSummary = llmData.candidates[0].content.parts[0].text.trim();
            } else {
                throw new Error("Invalid output content structure from remote model parsing.");
            }
        } catch (apiError) {
            console.warn("LLM Pipeline Interrupted, routing sequence to structural fallback template:", apiError.message);

            executiveSummary = `Your development cluster currently presents an allocation profile spending $${totalSpend}/mo across ${tools.length} active instances. Based on your target execution parameters for ${useCase} workloads with a headcount baseline of ${teamSize}, consolidating your system architecture onto dedicated environments and utilizing institutional pricing configurations lowers your predictable operational spend floor to an estimated $${optimizedTotal}/mo. This transition mitigates systematic workspace fragmentation while recovering capital margins.`;
        }

  
        const newReport = await AuditReport.create({
            totalSpend,
            optimizedTotal,
            teamSize,
            useCase,
            tools,
            redundancies,
            aiAlternatives,
            executiveSummary
        });

        res.status(201).json({
            success: true,
            auditId: newReport._id,
            optimizedTotal: newReport.optimizedTotal,
            executiveSummary: newReport.executiveSummary,
            redundancies: newReport.redundancies,
            aiAlternatives: newReport.aiAlternatives
        });

    } catch (err) {
        console.error("Audit operational tracking block fault:", err);
        res.status(500).json({ success: false, error: "Internal processing architecture encountered an evaluation anomaly." });
    }
});


app.get('/api/audit/:id', async (req, res) => {
    try {
        const audit = await AuditReport.findById(req.params.id);
        if (!audit) {
            return res.status(404).json({ success: false, error: "The requested tracking reference profile does not exist or has expired." });
        }

        res.json({
            success: true,
            totalSpend: audit.totalSpend,
            optimizedTotal: audit.optimizedTotal,
            teamSize: audit.teamSize,
            useCase: audit.useCase,
            tools: audit.tools,
            redundancies: audit.redundancies,
            aiAlternatives: audit.aiAlternatives,
            executiveSummary: audit.executiveSummary
        });
    } catch (error) {
        res.status(500).json({ success: false, error: "The provided optimization link structure format is invalid." });
    }
});

app.post('/api/lead', auditLimiter, async (req, res) => {
    try {
        const { email, company, role, auditId } = req.body;

        if (!email || !auditId) {
            return res.status(400).json({ success: false, error: "Target email credentials and associated report matrices are mandatory." });
        }

        await Lead.create({ email, company, role, auditId });

        console.log(`\n==================================================`);
        console.log(`STUB TRANSACTIONAL SYSTEM OUTBOUND EMAIL ROUTE`);
        console.log(`Target Recipient Address: ${email}`);
        console.log(`Subject Line: Credex Infrastructure Optimization Breakdown Blueprint`);
        console.log(`Body Context: Verification token initialized for reference parameter [${auditId}]. An institutional specialist will compile matching high-volume allocation discounts.`);
        console.log(`==================================================\n`);

        res.status(201).json({ success: true, message: "Lead identity records securely written to tracking cluster." });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to securely save lead profiling data parameters." });
    }
});

app.listen(PORT, () => {
    console.log(`Server orchestration engine executing efficiently on port allocation: ${PORT}`);
});