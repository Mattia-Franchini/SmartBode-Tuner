"""
File: core_logic.py
Description: Placeholder AI Engine updated for Bento Layout.
             Provides structured data for Bode, Step Response, and Nyquist.
             
Authors: Mattia Franchini & Michele Bisignano
Version: 0.9.7 (Placeholder)
"""

import numpy as np

class BodeOptimizer:
    def __init__(self, numerator, denominator, target_pm):
        self.num = numerator
        self.den = denominator
        self.target_pm = target_pm

    def optimize(self):
        """Simulates the optimization process."""
        k_val = round(1.5 + (self.target_pm / 100), 4)
        return {
            "K": k_val,
            "T": 0.25,
            "alpha": 0.1,
            "phaseMargin": self.target_pm + 0.05,
            "gainMargin": 12.4,
            "type": "LEAD"
        }

    def get_bode_data(self):
        """Generates synthetic Bode plot points."""
        freq = np.logspace(-1, 3, 100).tolist()
        original_mag = [20 - (10 * np.log10(f)) for f in freq]
        compensated_mag = [m + 5 for m in original_mag]
        original_phase = [-45 - (45 * np.log10(f)) for f in freq]
        compensated_phase = [p + 30 if 5 < f < 50 else p for f, p in zip(freq, original_phase)]

        return {
            "original": {"magnitude": original_mag, "phase": original_phase},
            "compensated": {"magnitude": compensated_mag, "phase": compensated_phase},
            "frequency": freq
        }

    def get_step_data(self):
        """Generates synthetic Step Response points."""
        t = np.linspace(0, 5, 100).tolist()
        y = [1 - (np.exp(-1.2 * x) * np.cos(4 * x)) for x in t]
        return {"time": t, "amplitude": y}

    def get_nyquist_data(self):
        """
        Generates synthetic Nyquist plot points (Real vs Imaginary).
        Simulates a typical spiral-like frequency response.
        """
        # Create a frequency-like parameter
        t = np.linspace(0, 10, 200)
        # Real part: starts positive, goes to negative then nears zero
        real = (2 * np.exp(-0.5 * t) * np.cos(t) - 0.2).tolist()
        # Imaginary part: oscillating and decaying
        imag = (2 * np.exp(-0.5 * t) * np.sin(t)).tolist()
        
        return {"real": real, "imag": imag}