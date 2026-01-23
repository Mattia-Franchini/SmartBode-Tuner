/**
 * @file timeUtils.ts
 * @description Logic for time-dependent UI greetings.
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.0.0
 */

export const getGreeting = (hour: number): string => {
    if (hour >= 5 && hour < 12) return "Buongiorno";
    if (hour >= 12 && hour < 18) return "Buon pomeriggio";
    return "Buonasera";
};