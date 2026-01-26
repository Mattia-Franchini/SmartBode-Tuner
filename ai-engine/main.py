"""
File: main.py
Description: FastAPI wrapper for the SmartBode AI Engine.
             Updated to include Step Response data in the final JSON response.

Authors: Mattia Franchini & Michele Bisignano
Version: 0.9.6 (Placeholder)
"""

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import time
from core_logic import BodeOptimizer

app = FastAPI(title="SmartBode AI Engine (Mock Mode)")

class OptimizationRequest(BaseModel):
    numerator: List[float]
    denominator: List[float]
    targetPhaseMargin: float

@app.post("/optimize")
async def optimize_endpoint(request: OptimizationRequest):
    start_time = time.time()
    
    engine = BodeOptimizer(
        numerator=request.numerator, 
        denominator=request.denominator, 
        target_pm=request.targetPhaseMargin
    )
    
    time.sleep(1.2) # Simulate GA processing time
    
    result = engine.optimize()
    bode_data = engine.get_bode_data()
    # --- NEW: Get Step Response Data ---
    step_data = engine.get_step_data() 
    
    return {
        "success": True,
        "compensator": {
            "K": result["K"],
            "T": result["T"],
            "alpha": result["alpha"],
            "type": result["type"]
        },
        "margins": {
            "pm": result["phaseMargin"],
            "gm": result["gainMargin"]
        },
        "bode": bode_data,
        # --- NEW: Send to Frontend ---
        "stepResponse": step_data, 
        "meta": {
            "executionTime": int((time.time() - start_time) * 1000),
            "engine": "v0.9-placeholder"
        }
    }