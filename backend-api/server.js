/**
 * @file server.js
 * @description Main entry point for the SmartBode Tuner Backend API.
 * This server acts as an orchestrator between the React Frontend 
 * and the Python AI Computational Engine.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.0.0
 */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// --- DATABASE CONNECTION ---
// Connects to the local MongoDB instance. 
// Database name: smartbode
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartbode';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB (Local)'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));


// --- MIDDLEWARE ---
app.use(cors()); 
app.use(express.json()); 

// --- ROUTES ---

/**
 * @route GET /
 * @description Health check route to verify the server status.
 */
app.get('/', (req, res) => {
    res.json({
        status: "Online",
        project: "SmartBode Tuner API",
        authors: ["Mattia Franchini", "Michele Bisignano"],
        timestamp: new Date().toISOString()
    });
});

/**
 * @route POST /api/optimize
 * @description Bridge route that will eventually call the Python AI Engine.
 * For now, it returns a confirmation message.
 */
app.post('/api/optimize', (req, res) => {
    const { numerator, denominator, targetPhaseMargin } = req.body;
    
    console.log(`[Optimization Request] Received system with num: [${numerator}], den: [${denominator}]`);

    res.status(200).json({
        success: true,
        message: "Data successfully received by the Node.js server.",
        receivedData: { numerator, denominator, targetPhaseMargin }
    });
});

// --- SERVER START ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 SMARTBODE BACKEND IS LIVE`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`👨‍💻 AUTHORS: Mattia Franchini & Michele Bisignano`);
    console.log(`=================================================\n`);
});