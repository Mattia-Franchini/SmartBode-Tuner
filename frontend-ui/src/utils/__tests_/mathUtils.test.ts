import { describe, it, expect } from 'vitest';
import { parseCSVToNumbers } from '../mathUtils';

describe('mathUtils - parseCSVToNumbers', () => {
    it('should convert a standard CSV string to an array of numbers', () => {
        expect(parseCSVToNumbers("1, 2, 10")).toEqual([1, 2, 10]);
    });

    it('should handle extra spaces and decimals', () => {
        expect(parseCSVToNumbers("  1.5 , 2.2,  3 ")).toEqual([1.5, 2.2, 3]);
    });

    it('should ignore letters and invalid characters', () => {
        expect(parseCSVToNumbers("1, error, 10")).toEqual([1, 10]);
    });

    it('should return an empty array for empty strings', () => {
        expect(parseCSVToNumbers("   ")).toEqual([]);
    });
});