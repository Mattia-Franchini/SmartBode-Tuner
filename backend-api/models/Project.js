/**
 * @file Project.js
 * @description Mongoose schema for storing Control System Design projects.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.0.0
 */

const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    // Name chosen by the user for the project
    projectName: {
        type: String,
        required: true,
        default: "Untitled Design"
    },
    
    // Plant G(s) parameters provided by the user
    plantData: {
        numerator: [Number],
        denominator: [Number],
        targetPhaseMargin: Number
    },

    // Optimization results found by the AI engine
    results: {
        K: Number,
        T: Number,
        alpha: Number,
        type: { type: String, enum: ['LEAD', 'LAG'] },
        achievedPM: Number,
        achievedGM: Number
    },

    // System Metadata
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', ProjectSchema);