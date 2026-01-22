/**
 * @file server.js
 * @description Main entry point for the SmartBode Tuner Backend API.
 * This server acts as an orchestrator between the React Frontend 
 * and the Python AI Computational Engine.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.1.0
 */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const Project = require('./models/Project');

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

/**
 * @route POST /api/projects
 * @description Receives system data, generates a result, and saves it.
 * Matches the OptimizationResponse frontend interface.
 */
app.post('/api/projects', async (req, res) => {
    try {
        const { projectName, inputData } = req.body;

        // 1. Generate Mock Results
        const mockResults = {
            K: parseFloat((Math.random() * 10 + 1).toFixed(4)),
            T: 0.25,
            alpha: 0.1,
            type: 'LEAD'
        };

        const margins = {
            pm: 52.5,
            gm: 12.0
        };

        // 2. Save to MongoDB
        // Ensure your model (Project.js) matches this structure
        const newProject = new Project({
            projectName: projectName || "Automated Design",
            inputData: inputData,
            results: {
                ...mockResults,
                pm: margins.pm,
                gm: margins.gm
            }
        });

        const savedProject = await newProject.save();
        console.log(`[Database] Success: Saved project ${savedProject._id}`);

        // 3. Send Response (MUST match OptimizationResponse interface)
        res.status(201).json({
            success: true,
            compensator: mockResults,
            margins: margins, // Crucial for Frontend
            bode: {
                original: {
                    frequency: [0.1, 1, 10, 100],
                    magnitude: [20, 10, -10, -30],
                    phase: [-5, -45, -90, -170]
                },
                compensated: {
                    frequency: [0.1, 1, 10, 100],
                    magnitude: [25, 15, -5, -25],
                    phase: [-2, -20, -60, -140]
                }
            },
            meta: {
                executionTime: 450,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        // Log the SPECIFIC error to the terminal
        console.error("❌ BACKEND ERROR:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error", 
            error: error.message 
        });
    }
});

// --- AUTHENTICATION ROUTES ---

/**
 * @route POST /api/auth/register
 * @description Create a new user account with hashed password.
 */
app.post('/api/auth/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already registered" });

        // Hash the password (Security First!)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ success: true, message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Registration error", error: error.message });
    }
});

/**
 * @route POST /api/auth/login
 * @description Verify credentials and allow access.
 */
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // 2. Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // Login success
        res.status(200).json({
            success: true,
            user: { id: user._id, fullName: user.fullName, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: "Login error", error: error.message });
    }
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