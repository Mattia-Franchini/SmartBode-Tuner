/**
 * @file mathUtils.ts
 * @description Robust utility for parsing user input strings into numerical arrays.
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.0.0
 */

export const parseCSVToNumbers = (input: string): number[] => {
    if (!input || !input.trim()) return [];
    
    return input
        .split(',')
        .map(val => {
            const parsed = parseFloat(val.trim());
            return parsed;
        })
        .filter(val => !isNaN(val)); // Filters out invalid inputs or empty segments
};