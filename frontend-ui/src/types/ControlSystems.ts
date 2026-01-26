/**
 * @file ControlSystems.ts
 * @description Domain Model Definitions for the SmartBode Tuner.
 * 
 * This file establishes the "Data Contract" between the Frontend Dashboard
 * and the Backend/AI services. It strictly types the physical quantities
 * involved in the control system synthesis (LTI models, frequency response data,
 * and compensator parameters).
 * 
 * @author [Mattia Franchini & Michele Bisignano]
 * @version 1.1.0
 */

/**
 * Represents the user input required to define the control problem.
 * Includes the Open-Loop Transfer Function G(s) and performance specifications.
 */
export interface SystemInput {
    /** Coefficients of the numerator polynomial (descending power of s). */
    numerator: number[];

    /** Coefficients of the denominator polynomial (descending power of s). */
    denominator: number[];

    /** The desired Phase Margin in degrees (e.g., 50.0). */
    targetPhaseMargin: number;
}

export interface StepResponseData {
    time: number[];      
    amplitude: number[]; 
}

/**
 * Represents the parameters of the synthesized Lead/Lag compensator C(s).
 * Transfer Function format: C(s) = K * (1 + T*s) / (1 + alpha*T*s)
 */
export interface Compensator {
    /** Static Gain (K). */
    K: number;

    /** Time Constant (T) in seconds. */
    T: number;

    /** Attenuation/Amplification factor (alpha). */
    alpha: number;

    /** Classification of the network topology. */
    type: 'LEAD' | 'LAG';
}

/**
 * Raw data vectors used for rendering Bode Plots via Plotly.js.
 * All arrays must have the same length.
 */
export interface BodePlotData {
    /** Frequency vector [rad/s] (Logarithmic X-Axis). */
    frequency: number[];

    /** Magnitude vector [dB] (Y1-Axis). */
    magnitude: number[];

    /** Phase vector [degrees] (Y2-Axis). */
    phase: number[];
}

/**
 * The complete payload response returned by the Optimization API.
 * Contains the optimal solution, simulation data, and performance metrics.
 */
export interface OptimizationResponse {
    /** Indicates if the optimization algorithm converged to a stable solution. */
    success: boolean;

    /** The optimal compensator parameters found by the AI. */
    compensator: Compensator;

    /** Frequency response data for visualization. */
    bode: {
        /** Data for the uncompensated system G(s) (for comparison). */
        original: BodePlotData;

        /** Data for the compensated system L(s) = C(s)G(s). */
        compensated: BodePlotData;
    };

    stepResponse: StepResponseData; 

    /** Achieved stability margins. */
    margins: {
        /** The actual Phase Margin achieved [deg]. */
        pm: number;

        /** The actual Gain Margin achieved [dB]. */
        gm: number;
    };

    inputData?: SystemInput;

    /** Metadata about the request execution. */
    meta: {
        /** Computational time in milliseconds. */
        executionTime: number;

        /** ISO timestamp of the result. */
        timestamp: string;
    };
}

/**
 * Represents a registered user in the system.
 */
export interface User {
    id: string;
    fullName: string;
    email: string;
}

/**
 * Response from the Authentication API.
 */
export interface AuthResponse {
    success: boolean;
    message?: string;
    user?: User;
}