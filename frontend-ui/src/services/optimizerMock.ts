/**
 * @file optimizerMock.ts
 * @description Mock Service for the Optimization API.
 * 
 * This module simulates the behavior of the Python AI Engine. 
 * It allows Frontend development and UI testing to proceed independently 
 * of the Backend implementation. It returns synthetic data compliant 
 * with the `OptimizationResponse` interface.
 * 
 * @author [Your Name]
 * @version 1.0.0
 */

import type { OptimizationResponse, SystemInput } from '../types/ControlSystems';

/**
 * Utility function to simulate network latency or computational delay.
 * @param ms - Delay duration in milliseconds.
 */
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Simulates the asynchronous optimization process.
 * Instead of calling the actual HTTP endpoint, it waits for a set delay
 * and returns pre-calculated (hardcoded) valid Bode data.
 * 
 * @param input - The user-defined control system specifications.
 * @returns A Promise that resolves to a mock `OptimizationResponse`.
 */
export const mockOptimization = async (input: SystemInput): Promise<OptimizationResponse> => {
    // Log the input to verify that the UI is passing data correctly
    console.log("[Mock Service] Received input:", input);

    // Simulate the computational time of the Genetic Algorithm (e.g., 1.5s)
    await wait(1500);

    // Synthetic frequency vector (Logarithmic distribution)
    // In production, this would contain hundreds of points.
    const freq = [0.1, 1, 10, 100, 1000];
    
    // Construct the response object strictly following the interface
    return {
        success: true,
        
        // Mocked Optimal Compensator (Lead Network example)
        compensator: {
            K: 5.4,       // Optimal Gain
            T: 0.23,      // Time Constant [s]
            alpha: 0.15,  // Attenuation factor (< 1 implies LEAD)
            type: 'LEAD'
        },

        // Mocked Stability Margins
        margins: {
            pm: 52.1,     // Phase Margin [deg]
            gm: 12.5      // Gain Margin [dB]
        },

        // Synthetic Bode Plot Data
        bode: {
            // Data for the uncompensated system G(s)
            original: {
                frequency: freq,
                magnitude: [20, 15, 0, -20, -40],
                phase: [-10, -45, -90, -135, -170]
            },
            // Data for the compensated system L(s) = C(s)G(s)
            // Shows improved phase and magnitude characteristics
            compensated: {
                frequency: freq,
                magnitude: [25, 20, 5, -15, -35], 
                phase: [-5, -25, -60, -110, -150] 
            }
        },

        // Metadata for debugging and performance tracking
        meta: {
            executionTime: 452, // Simulated execution time [ms]
            timestamp: new Date().toISOString()
        }
    };
};