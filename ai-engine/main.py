"""
File: main.py
Description: Main entry point for the AI Computational Engine (Microservice).
             It exposes REST endpoints using FastAPI to perform Differential Evolution
             optimization for Lead/Lag compensators.

Authors: Mattia Franchini & Michele Bisignano
Version: 1.0.0
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import random
import time
from datetime import datetime

app = FastAPI(
    title="SmartBode AI Engine",
    description="Microservice for Control System Optimization",
    version="1.0.0"
)

class SystemInput(BaseModel):
    numerator: List[float]
    denominator: List[float]
    targetPhaseMargin: float

def generate_bode_points():
    """Genera punti casuali per simulare un grafico di Bode"""
    freqs = [0.1, 0.5, 1.0, 5.0, 10.0, 50.0, 100.0]
    
    mag = [random.uniform(20, 40) - (i * 10) for i in range(len(freqs))]
    
    phase = [random.uniform(-5, 0) - (i * 25) for i in range(len(freqs))]
    
    return {"frequency": freqs, "magnitude": mag, "phase": phase}


@app.get("/")
def health_check():
    return {"status": "AI Engine Online", "authors": ["Mattia", "Michele"]}

@app.post("/optimize")
def optimize_system(data: SystemInput):
    print(f"--> Richiesta ricevuta: Target PM {data.targetPhaseMargin}°")
    
    time.sleep(1.5)

    mock_compensator = {
        "K": round(random.uniform(1.0, 10.0), 4),
        "T": round(random.uniform(0.01, 1.0), 4),
        "alpha": round(random.uniform(0.05, 0.5), 4),
        "type": random.choice(["LEAD", "LAG"])
    }

    achieved_pm = data.targetPhaseMargin + random.uniform(-2, 2)
    achieved_gm = random.uniform(10, 20)

    bode_original = generate_bode_points()
    
    bode_compensated = generate_bode_points()
    bode_compensated["phase"] = [p + 20 for p in bode_compensated["phase"]]

    return {
        "success": True,
        "compensator": mock_compensator,
        "margins": {
            "pm": round(achieved_pm, 2),
            "gm": round(achieved_gm, 2)
        },
        "bode": {
            "original": bode_original,
            "compensated": bode_compensated
        },
        "meta": {
            "executionTime": 1500, # ms
            "timestamp": datetime.now().isoformat()
        }
    }