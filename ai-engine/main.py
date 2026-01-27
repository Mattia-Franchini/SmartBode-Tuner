"""
File: main.py
Description: FastAPI wrapper for the SmartBode AI Engine.
             Exposes nested data structures for the Bento Grid UI.

Authors: Mattia Franchini & Michele Bisignano
Version: 0.9.7 (Placeholder)
"""

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import time
from core_logic import BodeOptimizer

app = FastAPI(title="SmartBode AI Engine (Bento Mode)")

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
    
    time.sleep(1.0) # Simulate computation
    
    result = engine.optimize()
    bode_data = engine.get_bode_data()
    step_data = engine.get_step_data()
    nyquist_data = engine.get_nyquist_data() # No arguments needed for placeholder
    
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
        "bode": {
            "original": bode_data["original"],
            "compensated": bode_data["compensated"],
            "nyquist": nyquist_data # Nested inside bode for TS compliance
        },
        "nyquist": nyquist_data,
        "stepResponse": step_data,
        "meta": {
            "executionTime": int((time.time() - start_time) * 1000),
            "engine": "v0.9.8-placeholder"
        }
    }