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
const bcrypt = require('bcryptjs');
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
 * @description Save project with owner ID.
 */
app.post('/api/projects', async (req, res) => {
    try {
        const { projectName, inputData, userId } = req.body;

        // 1. Simulazione Risultati AI (Mock)
        const K = parseFloat((Math.random() * 10 + 1).toFixed(4));
        const T = 0.25;
        const alpha = 0.1;
        const pm = 52.5;
        const gm = 12.0;

        // 2. Oggetto da salvare nel DB (Coerente con lo Schema Project.js)
        const newProject = new Project({
            userId: userId, // Importante: link all'utente
            projectName: projectName || `Design ${new Date().toLocaleTimeString()}`,
            inputData: inputData,
            results: {
                K, T, alpha, type: 'LEAD', // Parametri
                pm, gm                     // Margini
            }
        });

        const savedProject = await newProject.save();
        console.log(`[Database] Saved project: ${savedProject._id}`);

        // 3. RISPOSTA AL FRONTEND (CRUCIALE: Deve avere questa struttura esatta)
        res.status(201).json({
            success: true,

            // Per il componente CompensatorDetails
            compensator: { K, T, alpha, type: 'LEAD' },
            margins: { pm, gm },

            // Per il componente BodePlot (Dati finti per ora)
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

            meta: { timestamp: savedProject.createdAt }
        });

    } catch (error) {
        console.error("❌ BACKEND ERROR:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
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

// --- AUTHENTICATION ROUTES ---

/**
 * @route POST /api/auth/register
 * @description Create a new user account with hashed password.
 */
app.post('/api/auth/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        console.log("Tentativo di registrazione per:", email); // LOG DI DEBUG

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already registered" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ fullName, email, password: hashedPassword });
        await newUser.save();

        console.log("✅ Utente salvato con successo!");
        res.status(201).json({ success: true });
    } catch (error) {
        // QUESTO LOG VI DICE ESATTAMENTE COSA NON VA
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

// --- SERVER START ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 SMARTBODE BACKEND IS LIVE`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`👨‍💻 AUTHORS: Mattia Franchini & Michele Bisignano`);
    console.log(`=================================================\n`);
});