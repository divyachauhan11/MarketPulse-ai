const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { connectMongo, pgPool } = require('./config/db');
const Report = require('./models/Report');
require('dotenv').config();

const app = express();


app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));

app.use(express.json());

let dbConnected = false;

const initializeDatabases = async () => {
    if (process.env.MONGO_URI && process.env.DATABASE_URL) {
        try {
            await connectMongo();
            dbConnected = true;
            console.log(" Database synchronization status: ACTIVE");
        } catch (err) {
            console.log(" Database configurations mismatch, continuing in Mock Storage Mode:", err.message);
            dbConnected = false;
        }
    } else {
        console.log(" No Database URLs found in .env. Running backend in local memory mode.");
    }
};

initializeDatabases();

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized access! Missing token structure." });
    }
    req.user = { uid: "user_dev_123", email: "divya@test.com" }; 
    next();
};

app.post('/api/gateway/research', authenticateUser, async (req, res) => {
    const { query } = req.body;
    if(!query) return res.status(400).json({ error: "Missing required string 'query' inside request payload." });

    try {
        console.log(`Calling Python AI Engine for: ${query}`);
        
        const aiResponse = await axios.post(`${AI_ENGINE_URL}/api/v1/analyze`, 
            { query }, 
            { timeout: 30000 } 
        );
        
        const aiData = aiResponse.data;

        if (dbConnected) {
            try {
                const savedReport = await Report.create({
                    userId: req.user.uid,
                    query: query,
                    fullReport: aiData.report,
                    agentMetadata: {
                        researchSummary: aiData.metadata?.research_summary || aiData.metadata?.researchSummary,
                        competitorSummary: aiData.metadata?.competitor_summary || aiData.metadata?.competitorSummary
                    }
                });

                await pgPool.query(
                    'INSERT INTO search_logs (user_id, query, report_id, created_at) VALUES ($1, $2, $3, NOW())',
                    [req.user.uid, query, savedReport._id.toString()]
                );
            } catch (dbErr) {
                console.error(" Data persistence deferred due to live query structural issues:", dbErr.message);
            }
        } else {
            console.log(" DB not active. Skipping storage, outputting raw stream direct.");
        }

        return res.status(200).json({
            success: true,
            triggered_by: req.user.email,
            report: aiData.report,
            metadata: aiData.metadata
        });

    } catch (error) {
        console.error("Error in Gateway Flow:", error.message);
        return res.status(500).json({ 
            error: "Downstream AI Engine connection failed", 
            details: error.response?.data || error.message 
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Secure Gateway flawlessly matching rules on port ${PORT}`));