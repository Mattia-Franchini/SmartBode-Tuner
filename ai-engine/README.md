# 🧠 AI Computational Engine (Microservice)

**The mathematical core of the SmartBode Tuner platform.**

This microservice is responsible for the automatic synthesis of Lead/Lag compensators for LTI (Linear Time-Invariant) systems. It utilizes heuristic optimization algorithms to satisfy frequency domain requirements.

---

## 🛠️ Tech Stack

*   **Language:** Python 3.10+
*   **Framework:** FastAPI (High-performance web framework)
*   **Control Theory:** `python-control` (MATLAB-like system analysis)
*   **Optimization:** `scipy.optimize` (Differential Evolution)
*   **Math:** `numpy` (Vectorized calculations)

## 📐 Architecture & Logic

This service operates as a **Stateless Microservice**. It receives a JSON payload from the Node.js Backend, performs heavy computations, and returns the optimal parameters.

### Optimization Workflow
1.  **Input Parsing:** Receives Plant $G(s)$ and Target Phase Margin ($PM_{target}$).
2.  **Cost Function:** Generates candidate parameters ($K, T, \alpha$).
3.  **Simulation:** Uses `python-control` to calculate the open-loop margins ($PM_{actual}$).
4.  **Fitness Evaluation:** Minimizes the error $E = (PM_{target} - PM_{actual})^2$ while ensuring closed-loop stability.
5.  **Output:** Returns the best compensator $C(s)$ and the Bode plot data points.

---

## 🚀 Setup & Installation

### 1. Create Virtual Environment
It is recommended to run this service in an isolated environment.

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**
```bash
python -m venv venv
.\venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Server
The server will start on port `8000`.
```bash
uvicorn main:app --reload --port 8000
```

---

## 🔌 API Endpoints

### `POST /optimize`
Main endpoint for compensator design.

**Request Body (JSON):**
```json
{
  "numerator": [10],       // G(s) Num coefficients
  "denominator": [1, 2, 0], // G(s) Den coefficients
  "targetPhaseMargin": 50.0 // Degrees
}
```

**Response (JSON):**
```json
{
  "success": true,
  "compensator": {
    "K": 5.4,
    "T": 0.2,
    "alpha": 0.1,
    "type": "LEAD"
  },
  "margins": { "pm": 50.1, "gm": 12.5 },
  "bode": { ... },
  "meta": { "executionTime": 450 }
}
```

### `GET /docs`
Interactive API documentation (Swagger UI) is available at `http://localhost:8000/docs` when the server is running.

---

## 👥 Authors

**Mattia Franchini & Michele Bisignano**
