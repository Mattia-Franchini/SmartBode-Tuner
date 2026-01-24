"""
File: core_logic.py
Description: Placeholder AI Engine for SmartBode Tuner.
             This version provides realistic-looking data for integration testing
             without running intensive heuristic optimization.
             
Authors: Mattia Franchini & Michele Bisignano
Version: 0.9.0 (Placeholder)
"""

import numpy as np

class BodeOptimizer:
    def __init__(self, numerator, denominator, target_pm):
        """
        Initializes the optimizer with plant data.
        NOTE: Real LTI logic will be implemented here by the math specialist.
        """
        self.num = numerator
        self.den = denominator
        self.target_pm = target_pm

    def optimize(self):
        """
        Simulates the optimization process.
        Returns a plausible Lead Compensator based on the target Phase Margin.
        """
        # Placeholder logic: K increases slightly with target PM
        k_val = round(1.5 + (self.target_pm / 100), 4)
        t_val = 0.25
        alpha_val = 0.1
        
        # Simulated achieved margin (always near target for UI testing)
        achieved_pm = self.target_pm + 0.05 
        achieved_gm = 12.4
        
        return {
            "K": k_val,
            "T": t_val,
            "alpha": alpha_val,
            "phaseMargin": achieved_pm,
            "gainMargin": achieved_gm,
            "type": "LEAD"
        }

    def get_bode_data(self):
        """
        Generates synthetic Bode plot points that look like a real LTI system.
        """
        # Frequency vector from 10^-1 to 10^3
        freq = np.logspace(-1, 3, 100).tolist()
        
        # Simulate a falling magnitude (Low-pass behavior)
        original_mag = [20 - (10 * np.log10(f)) for f in freq]
        compensated_mag = [m + 5 for m in original_mag] # Slightly higher gain
        
        # Simulate phase shift
        original_phase = [-45 - (45 * np.log10(f)) for f in freq]
        # Compensated phase shows a 'bump' (Lead effect) near 10 rad/s
        compensated_phase = [p + 30 if 5 < f < 50 else p for f, p in zip(freq, original_phase)]

        return {
            "frequency": freq,
            "original": {
                "magnitude": original_mag,
                "phase": original_phase
            },
            "compensated": {
                "magnitude": compensated_mag,
                "phase": compensated_phase
            }
        }