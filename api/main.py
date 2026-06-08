
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import json
import pandas as pd

model = joblib.load("models/credit_score_model.pkl")

with open("models/feature_names.json") as f:
    feature_names = json.load(f)

app = FastAPI(
    title="AI Credit Scoring API",
    description="Alternative data credit scoring for Kenyan lenders",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class ApplicantData(BaseModel):
    owner_age: float
    personal_income: float
    business_expenses: float
    business_turnover: float
    business_age_years: float
    has_cellphone: int
    current_problem_cash_flow: int
    compliance_income_tax: int
    offers_credit_to_customers: int
    motor_vehicle_insurance: int

@app.get("/")
def root():
    return {
        "message": "AI Credit Scoring API is running",
        "version": "1.0.0",
        "model": "XGBoost"
    }

@app.post("/score")
def score_applicant(data: ApplicantData):
    input_df = pd.DataFrame([data.dict()])
    for col in feature_names:
        if col not in input_df.columns:
            input_df[col] = 0
    input_df = input_df[feature_names]
    prediction = model.predict(input_df)[0]
    probability = model.predict_proba(input_df)[0]
    credit_score = round(float(probability[1]) * 100, 2)
    if credit_score >= 75:
        risk_tier = "LOW RISK"
        recommendation = "Approve loan"
    elif credit_score >= 50:
        risk_tier = "MEDIUM RISK"
        recommendation = "Approve with conditions"
    else:
        risk_tier = "HIGH RISK"
        recommendation = "Decline or request collateral"
    return {
        "credit_score": credit_score,
        "risk_tier": risk_tier,
        "recommendation": recommendation,
        "has_mobile_money_prediction": bool(prediction)
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": True}
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import json
import pandas as pd
import os

# ── Absolute paths ─────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model = joblib.load(os.path.join(BASE_DIR, "models", "credit_score_model.pkl"))

with open(os.path.join(BASE_DIR, "models", "feature_names.json")) as f:
    feature_names = json.load(f)

# ── App setup ──────────────────────────────────────
app = FastAPI(
    title="AI Credit Scoring API",
    description="Alternative data credit scoring for Kenyan lenders",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# ── Input schema ───────────────────────────────────
class ApplicantData(BaseModel):
    owner_age: float
    personal_income: float
    business_expenses: float
    business_turnover: float
    business_age_years: float
    has_cellphone: int
    current_problem_cash_flow: int
    compliance_income_tax: int
    offers_credit_to_customers: int
    motor_vehicle_insurance: int

# ── Routes ─────────────────────────────────────────
@app.get("/")
def root():
    return {
        "message": "AI Credit Scoring API is running",
        "version": "1.0.0",
        "model": "XGBoost"
    }

@app.post("/score")
def score_applicant(data: ApplicantData):
    input_df = pd.DataFrame([data.dict()])
    for col in feature_names:
        if col not in input_df.columns:
            input_df[col] = 0
    input_df = input_df[feature_names]
    prediction = model.predict(input_df)[0]
    probability = model.predict_proba(input_df)[0]
    credit_score = round(float(probability[1]) * 100, 2)
    if credit_score >= 75:
        risk_tier = "LOW RISK"
        recommendation = "Approve loan"
    elif credit_score >= 50:
        risk_tier = "MEDIUM RISK"
        recommendation = "Approve with conditions"
    else:
        risk_tier = "HIGH RISK"
        recommendation = "Decline or request collateral"
    return {
        "credit_score": credit_score,
        "risk_tier": risk_tier,
        "recommendation": recommendation,
        "has_mobile_money_prediction": bool(prediction)
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": True}
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import json
import pandas as pd
import os

# ── Absolute paths ─────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model = joblib.load(os.path.join(BASE_DIR, "models", "credit_score_model.pkl"))

with open(os.path.join(BASE_DIR, "models", "feature_names.json")) as f:
    feature_names = json.load(f)

# ── App setup ──────────────────────────────────────
app = FastAPI(
    title="AI Credit Scoring API",
    description="Alternative data credit scoring for Kenyan lenders",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# ── Input schema ───────────────────────────────────
class ApplicantData(BaseModel):
    owner_age: float
    personal_income: float
    business_expenses: float
    business_turnover: float
    business_age_years: float
    has_cellphone: int
    current_problem_cash_flow: int
    compliance_income_tax: int
    offers_credit_to_customers: int
    motor_vehicle_insurance: int

# ── Routes ─────────────────────────────────────────
@app.get("/")
def root():
    return {
        "message": "AI Credit Scoring API is running",
        "version": "1.0.0",
        "model": "XGBoost"
    }

@app.post("/score")
def score_applicant(data: ApplicantData):
    input_df = pd.DataFrame([data.dict()])
    for col in feature_names:
        if col not in input_df.columns:
            input_df[col] = 0
    input_df = input_df[feature_names]
    prediction = model.predict(input_df)[0]
    probability = model.predict_proba(input_df)[0]
    credit_score = round(float(probability[1]) * 100, 2)
    if credit_score >= 75:
        risk_tier = "LOW RISK"
        recommendation = "Approve loan"
    elif credit_score >= 50:
        risk_tier = "MEDIUM RISK"
        recommendation = "Approve with conditions"
    else:
        risk_tier = "HIGH RISK"
        recommendation = "Decline or request collateral"
    return {
        "credit_score": credit_score,
        "risk_tier": risk_tier,
        "recommendation": recommendation,
        "has_mobile_money_prediction": bool(prediction)
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": True}
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import json
import pandas as pd
import os

# ── Absolute paths ─────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model = joblib.load(os.path.join(BASE_DIR, "models", "credit_score_model.pkl"))

with open(os.path.join(BASE_DIR, "models", "feature_names.json")) as f:
    feature_names = json.load(f)

# ── App setup ──────────────────────────────────────
app = FastAPI(
    title="AI Credit Scoring API",
    description="Alternative data credit scoring for Kenyan lenders",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# ── Input schema ───────────────────────────────────
class ApplicantData(BaseModel):
    owner_age: float
    personal_income: float
    business_expenses: float
    business_turnover: float
    business_age_years: float
    has_cellphone: int
    current_problem_cash_flow: int
    compliance_income_tax: int
    offers_credit_to_customers: int
    motor_vehicle_insurance: int

# ── Routes ─────────────────────────────────────────
@app.get("/")
def root():
    return {
        "message": "AI Credit Scoring API is running",
        "version": "1.0.0",
        "model": "XGBoost"
    }

@app.post("/score")
def score_applicant(data: ApplicantData):
    input_df = pd.DataFrame([data.dict()])
    for col in feature_names:
        if col not in input_df.columns:
            input_df[col] = 0
    input_df = input_df[feature_names]
    prediction = model.predict(input_df)[0]
    probability = model.predict_proba(input_df)[0]
    credit_score = round(float(probability[1]) * 100, 2)
    if credit_score >= 75:
        risk_tier = "LOW RISK"
        recommendation = "Approve loan"
    elif credit_score >= 50:
        risk_tier = "MEDIUM RISK"
        recommendation = "Approve with conditions"
    else:
        risk_tier = "HIGH RISK"
        recommendation = "Decline or request collateral"
    return {
        "credit_score": credit_score,
        "risk_tier": risk_tier,
        "recommendation": recommendation,
        "has_mobile_money_prediction": bool(prediction)
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": True}

if __name__ == '__main__':
    app.run(debug=True, port=5000)
