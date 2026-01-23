/// <reference types="cypress" />

/**
 * @file full_stack_flow.cy.ts
 * @description "Slow & Stable" E2E Test Suite.
 * Includes explicit pauses to allow Database writes and UI animations to complete 
 * without race conditions. Ideal for local development testing.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.2.0
 */

describe('SmartBode Tuner - Complete Lifecycle', () => {

    beforeEach(() => {
        cy.visit('http://localhost:5173');
    });

    it('Guarantees Security, Auth, and Computation flow (Stabilized)', () => {
        // --- 0. NETWORK INTERCEPTION ---
        // We listen for API calls to know exactly when the backend has finished
        cy.intercept('POST', '/api/auth/register').as('registerRequest');
        cy.intercept('POST', '/api/auth/login').as('loginRequest');
        cy.intercept('POST', '/api/projects').as('optimizeRequest');

        // --- 1. SECURITY CHECK ---
        cy.contains('Design Area Restricted', { timeout: 10000 }).should('be.visible');
        cy.contains('Sign In to Unlock').click();

        // Small pause for modal animation
        cy.wait(500);

        // --- 2. USER REGISTRATION ---
        const uniqueId = Date.now();
        const testEmail = `test_${uniqueId}@polimi.it`;
        const testPass = 'password123';

        // Click Register Tab
        cy.get('[role="dialog"]').contains('button', 'Register').click();
        cy.wait(500); // Wait for tab switch

        // Fill Registration Form
        cy.get('[role="dialog"]').within(() => {
            cy.contains('label', 'Full Name').parent().find('input').type('Cypress Bot', { delay: 50 }); // Type slower
            cy.contains('label', 'Email Address').parent().find('input').type(testEmail, { delay: 20 });
            cy.contains('label', 'Password').parent().find('input').type(testPass, { delay: 20 });

            cy.get('button.MuiButton-contained').contains('Register').click();
        });

        // WAIT FOR BACKEND: Ensure user is saved in MongoDB
        cy.wait('@registerRequest').its('response.statusCode').should('eq', 201);

        // UI PAUSE: Wait for the success alert to appear and disappear
        cy.on('window:alert', () => true);
        cy.wait(1000); // 1 second pause to let the system settle

        // --- 3. LOGIN ---
        // Ensure we are on Login tab
        cy.get('[role="dialog"]').contains('button', 'Login').click();
        cy.wait(500);

        cy.get('[role="dialog"]').within(() => {
            cy.contains('label', 'Email Address').parent().find('input').clear().type(testEmail, { delay: 20 });
            cy.contains('label', 'Password').parent().find('input').clear().type(testPass, { delay: 20 });
            cy.contains('button', 'Sign In').click();
        });

        // WAIT FOR BACKEND: Ensure login is processed
        cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

        // UI PAUSE: Wait for modal to close and dashboard to fade in
        cy.wait(1500);

        // --- 4. DASHBOARD VERIFICATION ---
        cy.get('[role="dialog"]').should('not.exist').then(() => {
            cy.contains('System Config', { timeout: 15000 }).should('be.visible');
        });

        // --- 5. OPTIMIZATION ---
        // Fill the form
        cy.contains('label', 'Target Phase Margin').parent().find('input').clear().type('60', { delay: 100 });
        cy.wait(500);

        cy.contains('button', 'Optimize Compensator').click();

        // Verify loading state
        cy.contains('Computing...').should('be.visible');

        // WAIT FOR BACKEND: Wait for calculation and save
        cy.wait('@optimizeRequest', { timeout: 25000 }).its('response.statusCode').should('eq', 201);

        // UI PAUSE: Wait for charts to render
        cy.wait(1000);

        // --- 6. RESULTS VALIDATION ---
        cy.contains('Optimal Solution').should('be.visible');
        cy.contains('C(s) =').should('be.visible');

        // --- 7. LOGOUT ---
        cy.get('header').find('.MuiAvatar-root').click();
        cy.wait(500); // Wait for dropdown menu animation
        cy.contains('Logout').click();

        // Final verification
        cy.contains('Design Area Restricted').should('be.visible');
    });
});