from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import create_model
import joblib
import json
import pandas as pd
import os
from typing import Optional

# ── Paths ──────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "credit_score_model.pkl")
FEATURES_PATH = os.path.join(BASE_DIR, "models", "feature_names.json")
DATA_PATH = os.path.join(BASE_DIR, "data", "train_cleaned.csv")

# ── Auto-train if model missing ─────────────────────
os.makedirs(os.path.join(BASE_DIR, "models"), exist_ok=True)

if not os.path.exists(MODEL_PATH) or not os.path.exists(FEATURES_PATH):
    print("Model not found — training now...")
    from xgboost import XGBClassifier
    from sklearn.model_selection import train_test_split
    df = pd.read_csv(DATA_PATH)
    X = df.drop(columns=[c for c in ['has_mobile_money','Target'] if c in df.columns])
    y = df['has_mobile_money']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    m = XGBClassifier(n_estimators=100, random_state=42, eval_metric='logloss', verbosity=0)
    m.fit(X_train, y_train)
    joblib.dump(m, MODEL_PATH)
    with open(FEATURES_PATH, 'w') as f:
        json.dump(X.columns.tolist(), f)
    print("Model trained and saved!")

# ── Load model & features ──────────────────────────
model = joblib.load(MODEL_PATH)

with open(FEATURES_PATH) as f:
    feature_names = json.load(f)

print(f"Model loaded! Features: {len(feature_names)}")

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

# ── Dynamic Input Schema ───────────────────────────
fields = {name: (Optional[float], 0.0) for name in feature_names}
ApplicantData = create_model('ApplicantData', **fields)

# ── Routes ─────────────────────────────────────────
@app.get("/")
def root():
    return {
        "message": "AI Credit Scoring API is running",
        "version": "1.0.0",
        "model": "XGBoost",
        "features": len(feature_names)
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