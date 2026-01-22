/**
 * @file authService.ts
 * @description Authentication service to handle Login and Registration with Node.js.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.0.0
 */

import axios from 'axios';
import type { AuthResponse } from '../types/ControlSystems';

const API_URL = 'http://localhost:3000/api/auth';

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
};

export const registerUser = async (fullName: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/register`, { fullName, email, password });
    return response.data;
};