import { describe, it, expect } from 'vitest';
import { getGreeting } from '../timeUtils';

describe('timeUtils - getGreeting', () => {
    it('returns Buongiorno for morning hours (9 AM)', () => {
        expect(getGreeting(9)).toBe("Buongiorno");
    });

    it('returns Buon pomeriggio for afternoon hours (3 PM)', () => {
        expect(getGreeting(15)).toBe("Buon pomeriggio");
    });

    it('returns Buonasera for evening/night hours (9 PM)', () => {
        expect(getGreeting(21)).toBe("Buonasera");
    });
});