/**
 * @file apiService.ts
 * @description Real HTTP service to communicate with the Node.js Backend.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.2.0
 */

import axios from 'axios';
import type { SystemInput, OptimizationResponse } from '../types/ControlSystems';

const API_URL = 'http://localhost:3000/api';

/**
 * Fetches the project history for a specific user.
 */
export const getUserProjects = async (userId: string) => {
    try {
        const response = await axios.get(`${API_URL}/projects/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
};

/**
 * Sends system data to the Node.js backend to perform optimization and save results.
 * This triggers the calculation (currently mocked in Node) and DB persistence.
 */
export const performOptimization = async (input: SystemInput, userId: string): Promise<OptimizationResponse> => {

    const autoProjectName = `Design ${new Date().toLocaleTimeString()}`;

    const response = await axios.post(`${API_URL}/projects`, {
        userId,       
        projectName: autoProjectName, 
        inputData: input
    });

    return response.data;
};

/**
 * Deletes a project from the database.
 */
export const deleteProject = async (projectId: string) => {
    const response = await axios.delete(`${API_URL}/projects/${projectId}`);
    return response.data;
};

/**
 * Updates a project's name in the database.
 * @param projectId Unique ID of the project
 * @param newName The new name string
 */
export const updateProjectName = async (projectId: string, newName: string) => {
    const response = await axios.put(`${API_URL}/projects/${projectId}`, {
        projectName: newName
    });
    return response.data;
};