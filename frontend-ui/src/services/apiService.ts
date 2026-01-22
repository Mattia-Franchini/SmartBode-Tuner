/**
 * @file apiService.ts
 * @description Real HTTP service to communicate with the Node.js Backend.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.1.0
 */

import axios from 'axios';
import type { SystemInput, OptimizationResponse } from '../types/ControlSystems';

const API_URL = 'http://localhost:3000/api';

/**
 * Sends system data to the Node.js backend to perform optimization and save results.
 * @param input The plant parameters and target specifications.
 */
export const performOptimization = async (input: SystemInput): Promise<OptimizationResponse> => {
    const response = await axios.post(`${API_URL}/projects`, {
        projectName: "Web Design Session",
        inputData: {
            numerator: input.numerator,
            denominator: input.denominator,
            targetPhaseMargin: input.targetPhaseMargin
        }
    });

    return response.data;
};