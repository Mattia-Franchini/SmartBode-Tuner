/**
 * @file CompensatorDetails.test.tsx
 * @description Unit tests for the Results Card component.
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.0.0
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CompensatorDetails from '../CompensatorDetails';
import type { Compensator } from '../../types/ControlSystems';

const mockCompensator: Compensator = {
    K: 12.5,
    T: 0.1,
    alpha: 0.5,
    type: 'LEAD'
};

describe('CompensatorDetails Component', () => {
    it('renders the correct Gain K value', () => {
        render(<CompensatorDetails compensator={mockCompensator} pm={45} gm={10} />);
        
        const gainValue = screen.getByText('12.5000');
        expect(gainValue).toBeInTheDocument();
    });

    it('displays the correct network type', () => {
        render(<CompensatorDetails compensator={mockCompensator} pm={45} gm={10} />);
        
        const chip = screen.getByText('LEAD');
        expect(chip).toBeInTheDocument();
    });

    it('shows the correct Phase Margin', () => {
        render(<CompensatorDetails compensator={mockCompensator} pm={45.5} gm={10} />);
        
        expect(screen.getByText('45.50°')).toBeInTheDocument();
    });
});