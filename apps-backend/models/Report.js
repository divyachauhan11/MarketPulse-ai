const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    query: { type: String, required: true },
    fullReport: { type: String, required: true },
    agentMetadata: {
        researchSummary: String,
        competitorSummary: String
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);