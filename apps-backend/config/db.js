const mongoose = require('mongoose');
const { Pool } = require('pg');
require('dotenv').config();

const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/mock',
    ssl: false
});

const connectMongo = async () => {
    if (!process.env.MONGO_URI) {
        console.log("MongoDB URI missing in .env. Running database in isolated mock mode.");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully!');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
    }
};

module.exports = { pgPool, connectMongo };