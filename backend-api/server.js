/**
 * @file server.js
 * @description Main entry point for the SmartBode Tuner Backend API.
 * This server acts as an orchestrator between the React Frontend 
 * and the Python AI Computational Engine.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.2.0
 */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const axios = require('axios');
require('dotenv').config();

const app = express();
const Project = require('./models/Project');
const User = require('./models/User');

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
 * @route GET /api/projects/:userId
 * @description Fetch all projects belonging to a specific user.
 */
app.get('/api/projects/user/:userId', async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Error fetching history" });
    }
});

/**
 * @route POST /api/projects
 * @description Optimization Bridge:
 * 1. Receives input from Frontend.
 * 2. Forwards data to Python AI Engine for computation.
 * 3. Saves the result to MongoDB.
 * 4. Returns the optimized solution to the Frontend.
 */
app.post('/api/projects', async (req, res) => {
    try {
        const { projectName, inputData, userId } = req.body;

        console.log("[Node.js] 🔄 Calling Python AI Engine...");

        // 1. BRIDGE CALL TO PYTHON AI ENGINE (Microservice)
        // Forward the input data to the FastAPI service running on port 8000.
        const pythonResponse = await axios.post('http://127.0.0.1:8000/optimize', {
            numerator: inputData.numerator,
            denominator: inputData.denominator,
            targetPhaseMargin: inputData.targetPhaseMargin
        });

        // Extract the actual calculated results from the Python response
        const aiResults = pythonResponse.data;

        // 2. DATA PERSISTENCE (MongoDB)
        // Create a new project record linking the User, Input, and AI Results
        const newProject = new Project({
            userId: userId,
            projectName: projectName || `Design ${new Date().toLocaleTimeString()}`,
            inputData: inputData,
            results: {
                K: aiResults.compensator.K,
                T: aiResults.compensator.T,
                alpha: aiResults.compensator.alpha,
                type: aiResults.compensator.type,
                pm: aiResults.margins.pm,
                gm: aiResults.margins.gm
            }
        });

        const savedProject = await newProject.save();
        console.log(`[Database] ✅ Project saved successfully: ${savedProject._id}`);

        // 3. RESPONSE TO FRONTEND
        // Send back the combined data (AI results + Database Metadata)
        res.status(201).json({
            success: true,
            ...aiResults, // Spreads: compensator, margins, bode, etc.
            meta: { timestamp: savedProject.createdAt }
        });

    } catch (error) {
        console.error("❌ BRIDGE ERROR:", error.message);

        // Specific handling if the Python Microservice is offline
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                success: false,
                message: "AI Engine (Python) is offline. Please start the FastAPI server."
            });
        }

        res.status(500).json({
            success: false,
            message: "Optimization failed during processing.",
            error: error.message
        });
    }
});

/**
 * @route DELETE /api/projects/:id
 * @description Delete a specific project by ID.
 */
app.delete('/api/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Project.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        console.log(`[Database] Deleted project: ${id}`);
        res.json({ success: true, message: "Project deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting project", error });
    }
});

/**
 * @route PUT /api/projects/:id
 * @description Updates the name of an existing project.
 */
app.put('/api/projects/:id', async (req, res) => {
    try {
        const { projectName } = req.body;
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id, 
            { projectName }, 
            { new: true } 
        );

        if (!updatedProject) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        console.log(`[Database] Renamed project ${req.params.id} to "${projectName}"`);
        res.json({ success: true, project: updatedProject });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Error updating project", error });
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
        console.log("Tentativo di registrazione per:", email); 

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already registered" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ fullName, email, password: hashedPassword });
        await newUser.save();

        console.log("✅ Utente salvato con successo!");
        res.status(201).json({ success: true });
    } catch (error) {
        console.error("❌ ERRORE CRITICO REGISTRAZIONE:", error);
        res.status(500).json({ message: "Registration error", details: error.message });
    }
});

/**
 * @route POST /api/auth/login
 * @description Verify credentials and allow access.
 * 
 * @authors Mattia Franchini & Michele Bisignano
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

        // --- ADDED LOG MESSAGE ---
        // Stampa nel terminale del server chi ha effettuato l'accesso
        console.log(`[Auth] ✅ User successfully logged in: ${user.fullName} (${user.email})`);
        // -------------------------

        // Login success
        res.status(200).json({
            success: true,
            user: { id: user._id, fullName: user.fullName, email: user.email }
        });
    } catch (error) {
        // Log error for debugging
        console.error(`[Auth] ❌ Login error for ${req.body.email}:`, error.message);
        res.status(500).json({ message: "Login error", error: error.message });
    }
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`\n=================================================`);
        console.log(`🚀 SMARTBODE BACKEND IS LIVE`);
        console.log(`📡 URL: http://localhost:${PORT}`);
        console.log(`👨‍💻 AUTHORS: Mattia Franchini & Michele Bisignano`);
        console.log(`=================================================\n`);
    });
}

/**
 * @description Export the app instance.
 * Required for the Jest/Supertest suite to perform API integration testing.
 */
module.exports = app;