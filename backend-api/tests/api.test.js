/**
 * @file api.test.js
 * @description Integration tests for the Backend REST API.
 * Validates Authentication, Project Management, and Database persistence.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.0.0
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Import the app instance

describe('SmartBode Tuner - API Integration Tests', () => {
    
    /**
     * Connection Cleanup: Ensure the database connection is closed 
     * after all tests are finished to prevent memory leaks.
     */
    afterAll(async () => {
        await mongoose.connection.close();
    });

    // --- 1. SMOKE TESTS (Basic Connectivity) ---
    describe('GET /', () => {
        it('should respond with 200 OK and valid JSON', async () => {
            const res = await request(app).get('/');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('project', 'SmartBode Tuner API');
        });
    });

    // --- 2. AUTHENTICATION TESTS ---
    describe('Auth API (/api/auth)', () => {
        
        /**
         * Test: Login failure with wrong credentials.
         */
        it('should return 404 if the user does not exist', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: "non-existent-user@polimi.it",
                    password: "wrongpassword"
                });
            expect(res.statusCode).toEqual(404);
            expect(res.body.success).toBeFalsy();
        });

        /**
         * Test: Registration failure with missing fields.
         */
        it('should return 500 or 400 if registration data is incomplete', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    fullName: "Incomplete User"
                    // Missing email and password
                });
            expect(res.statusCode).not.toBe(201);
        });
    });

    // --- 3. PROJECT MANAGEMENT TESTS ---
    describe('Project API (/api/projects)', () => {
        
        /**
         * Test: Attempting to fetch projects for a non-existent user ID.
         */
        it('should return an empty array if a new user ID has no projects', async () => {
            const fakeUserId = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/api/projects/user/${fakeUserId}`);
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBe(0);
        });
    });
});