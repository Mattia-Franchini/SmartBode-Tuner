"""
File: core_logic.py
Description: Mathematical Core for SmartBode Tuner.
             Uses python-control for LTI system analysis and SciPy (Differential Evolution)
             as the heuristic optimization engine to synthesize Lead/Lag compensators.

Authors: Mattia Franchini & Michele Bisignano
Version: 1.0.0
"""

import numpy as np
import control as ct
from scipy.optimize import differential_evolution

class BodeOptimizer:


    def __init__(self, numerator, denominator, target_pm, min_bandwidth, max_error):
        """
        Initializes the optimizer with the Plant (Process) transfer function.
    
        Args:
            numerator (list): Coefficients of the numerator.
            denominator (list): Coefficients of the denominator.
            target_pm (float): Desired Phase Margin in degrees.
        """
        self.num = numerator
        self.den = denominator
        self.target_pm = target_pm
        self.min_bandwidth = min_bandwidth
        self.max_error = max_error

        self.G = ct.TransferFunction(self.num, self.den)

        # Placeholders for the result
        self.C = None       # Controller Transfer Function
        self.L = None       # Open Loop Transfer Function L(s) = C(s)*G(s)
        self.T_sys = None   # Closed Loop Transfer Function T(s) = L(s) / (1 + L(s))
        self.best_params = {}


    def _objective_function(self, params):
        """
        Cost function for the Evolutionary Algorithm.
        params: [Gain (K), Zero (z), Pole (p)]
        
        The controller structure is: C(s) = K * (s + z) / (s + p)
        """
        K, z, p = params
        
        # Constraints: We generally want minimum phase controllers for stability
        if K <= 0 or z <= 0 or p <= 0:
            return 1e9 # High penalty for invalid parameters

        try:
            # Construct Controller C(s)
            C_candidate = ct.TransferFunction([K, K*z], [1, p])
        
            # Open Loop L(s)
            L_candidate = C_candidate * self.G
        
            # Calculate Margins
            # gm (Gain Margin), pm (Phase Margin), wg (Phase Crossover), wp (Gain Crossover)
            gm, pm, wg, wp = ct.margin(L_candidate)
        
            # Heuristic Cost Calculation:
            cost = 0.0
            penalty_weight = 1000.0


            if self.max_error is not None:
                k_loop = np.abs(ct.dcgain(L_candidate))
                # If infinite gain (Type 1+), steady-state error is 0
                e_ss = 0.0 if np.isinf(k_loop) else 1.0 / (1.0 + k_loop)
                
                if e_ss > self.max_error:
                    cost += PENALTY_WEIGHT * ((e_ss - self.max_error) / self.max_error) ** 2

                else:
                    cost -= (self.max_error - e_ss) * 50.0 

            # 2. Minimum Bandwidth Constraint
            if self.min_bandwidth is not None:
                if wp < self.min_bandwidth:
                    cost += PENALTY_WEIGHT * ((self.min_bandwidth - wp) / self.min_bandwidth) ** 2
                else:
                    cost -= (pm - self.target_pm) * 1.0

            # 3. Phase Margin Objective
            if pm < self.target_pm:
                cost += PENALTY_WEIGHT * (self.target_pm - pm) ** 2
            else:
                # Slight reward for exceeding target to ensure robustness
                cost -= (pm - self.target_pm) * 0.1

            return cost
        
        except Exception as e:
            return 1e9 # High penalty for any computational error


    def optimize(self):
        """
        Runs the Differential Evolution algorithm to find optimal controller parameters.
        """
        # Define bounds for the search: 
        # K: [0.1, 1000], z: [0.01, 100], p: [0.01, 100] (Adjust based on system dynamics)
        bounds = [(0.1, 500), (0.01, 100), (0.01, 100)]
        
        # Run Global Optimization (The "AI" Engine)
        result = differential_evolution(
            self._objective_function, 
            bounds, 
            strategy='best1bin', 
            maxiter=50, 
            popsize=15,
            mutation=(0.5, 1), 
            recombination=0.7,
            seed=42
        )
        
        # Extract best parameters
        K_opt, z_opt, p_opt = result.x
        
        # Create final Transfer Functions
        self.C = ct.TransferFunction([K_opt, K_opt*z_opt], [1, p_opt])
        self.L = self.C * self.G
        self.T_sys = ct.feedback(self.L, 1) # Closed loop
        
        # Calculate final margins
        gm, pm, wg, wp = ct.margin(self.L)
        
        # Convert to Lead/Lag standard form parameters: K * (Ts + 1) / (alpha*Ts + 1)
        # Our C(s) = K_opt * (s + z) / (s + p)
        # T = 1/z
        # alpha = z/p
        # Final DC Gain K_final = K_opt * (z/p)
        
        T_val = 1.0 / z_opt
        alpha_val = z_opt / p_opt
        K_dc = K_opt * (z_opt / p_opt)
        
        # Determine Type
        net_type = "LEAD" if alpha_val < 1 else "LAG"
        
        self.best_params = {
            "K": round(K_dc, 4),
            "T": round(T_val, 4),
            "alpha": round(alpha_val, 4),
            "phaseMargin": round(pm, 2),
            "gainMargin": round(20 * np.log10(gm), 2) if gm != 0 and not np.isinf(gm) else "Inf",
            "type": net_type
        }
        
        return self.best_params

    def get_bode_data(self):
        """Generates real Bode plot points using python-control."""
        if self.L is None:
            raise ValueError("Optimization must be run before fetching data.")

        # Frequency range: 0.01 rad/s to 1000 rad/s
        omega = np.logspace(-2, 3, 200)
        
        # Calculate Plant response (Uncompensated)
        mag_g, phase_g, omega = ct.bode(self.G, omega, plot=False)
        
        # Calculate Open Loop response (Compensated)
        mag_l, phase_l, _ = ct.bode(self.L, omega, plot=False)
        
        # Convert to list and dB for JSON serialization
        freq_list = omega.tolist()
        
        # Original (Plant Only)
        orig_mag_db = (20 * np.log10(mag_g)).tolist()
        orig_phase_deg = (phase_g * 180.0 / np.pi).tolist()
        
        # Compensated (Open Loop L=C*G)
        comp_mag_db = (20 * np.log10(mag_l)).tolist()
        comp_phase_deg = (phase_l * 180.0 / np.pi).tolist()

        return {
            "original": {"magnitude": orig_mag_db, "phase": orig_phase_deg},
            "compensated": {"magnitude": comp_mag_db, "phase": comp_phase_deg},
            "frequency": freq_list
        }
    
    def get_step_data(self):
        """Generates real Step Response of the Closed Loop system."""
        if self.T_sys is None:
            raise ValueError("Optimization must be run before fetching data.")

        # Time simulation
        t, y = ct.step_response(self.T_sys)
        
        return {
            "time": t.tolist(),
            "amplitude": y.tolist()
        }

    def get_nyquist_data(self):
        """
        Generates real Nyquist plot points (Real vs Imaginary) for L(s).
        """
        if self.L is None:
            raise ValueError("Optimization must be run before fetching data.")

        # Compute frequency response for Nyquist
        omega = np.logspace(-2, 3, 500)
        mag, phase, _ = ct.bode(self.L, omega, plot=False)
        
        # Convert polar (mag, phase) to rectangular (real, imag)
        # Phase is in radians from ct.bode
        complex_resp = mag * np.exp(1j * phase)
        
        real_part = np.real(complex_resp).tolist()
        imag_part = np.imag(complex_resp).tolist()
        
        return {"real": real_part, "imag": imag_part}