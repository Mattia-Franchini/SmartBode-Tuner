"""
File: core_logic.py
Description: Placeholder AI Engine for SmartBode Tuner.
             Updated to provide synthetic Step Response data for Time-Domain analysis.
             
Authors: Mattia Franchini & Michele Bisignano
Version: 0.9.6 (Placeholder)
"""

import numpy as np

class BodeOptimizer:
    def __init__(self, numerator, denominator, target_pm):
        """
        Initializes the optimizer with plant data.
        """
        self.num = numerator
        self.den = denominator
        self.target_pm = target_pm

    def optimize(self):
        """
        Simulates the optimization process.
        Returns a plausible Lead Compensator for integration testing.
        """
        k_val = round(1.5 + (self.target_pm / 100), 4)
        t_val = 0.25
        alpha_val = 0.1
        
        return {
            "K": k_val,
            "T": t_val,
            "alpha": alpha_val,
            "phaseMargin": self.target_pm + 0.05,
            "gainMargin": 12.4,
            "type": "LEAD"
        }

    def get_bode_data(self):
        """
        Generates synthetic Bode plot points (Frequency Domain).
        """
        freq = np.logspace(-1, 3, 100).tolist()
        original_mag = [20 - (10 * np.log10(f)) for f in freq]
        compensated_mag = [m + 5 for m in original_mag]
        original_phase = [-45 - (45 * np.log10(f)) for f in freq]
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

    def get_step_data(self):
        """
        Generates synthetic Step Response points (Time Domain).
        Simulates a typical underdamped closed-loop response settling at 1.0.
        """
        # Time vector from 0 to 5 seconds
        t = np.linspace(0, 5, 100).tolist()
        
        # Simulated response: y(t) = 1 - e^(-1.2t) * cos(4t)
        # This creates a realistic 'overshoot' and 'settling time' effect
        y = [1 - (np.exp(-1.2 * x) * np.cos(4 * x)) for x in t]
        
        return {
            "time": t,
            "amplitude": y
        }