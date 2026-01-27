/**
 * @file CompensatorDetails.test.tsx
 * @description Unit tests for the Results Card component.
 * Updated to include mandatory plantInput for MATLAB export logic.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.1.0
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CompensatorDetails from '../CompensatorDetails';
// FIX: Added SystemInput to the imports
import type { Compensator, SystemInput } from '../../../types/ControlSystems';

const mockPlantInput: SystemInput = {
    numerator: [10],
    denominator: [1, 2, 10],
    targetPhaseMargin: 45
};

const mockCompensator: Compensator = {
    K: 12.5,
    T: 0.1,
    alpha: 0.5,
    type: 'LEAD'
};

describe('CompensatorDetails Component', () => {
    
    it('renders the correct Gain K value', () => {
        render(
            <CompensatorDetails 
                compensator={mockCompensator} 
                pm={45} 
                gm={10} 
                plantInput={mockPlantInput} 
            />
        );
        
        const gainValue = screen.getByText('12.5000');
        expect(gainValue).toBeInTheDocument();
    });

    it('displays the correct network type', () => {
        render(
            <CompensatorDetails 
                compensator={mockCompensator} 
                pm={45} 
                gm={10} 
                plantInput={mockPlantInput} 
            />
        );
        
        const chip = screen.getByText('LEAD'); 
        expect(chip).toBeInTheDocument();
    });

    it('shows the correct Phase Margin', () => {
        render(
            <CompensatorDetails 
                compensator={mockCompensator} 
                pm={45.5} 
                gm={10} 
                plantInput={mockPlantInput} 
            />
        );
        
        expect(screen.getByText('45.50°')).toBeInTheDocument();
    });

    it('renders the mathematical formula C(s)', () => {
        render(
            <CompensatorDetails 
                compensator={mockCompensator} 
                pm={45} 
                gm={10} 
                plantInput={mockPlantInput} 
            />
        );
        
        expect(screen.getByText('C(s) =')).toBeInTheDocument();
    });
});