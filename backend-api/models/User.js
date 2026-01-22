/**
 * @file User.js
 * @description Mongoose schema for User Authentication.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.0.0
 */

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Impedisce email duplicate
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);