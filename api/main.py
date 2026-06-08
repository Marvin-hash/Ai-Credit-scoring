from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, create_model
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
if not os.path.exists(MODEL_PATH):
    print("⏳ Model not found — training now...")
    from xgboost import XGBClassifier
    from sklearn.model_selection import train_test_split
    df = pd.read_csv(DATA_PATH)
    X = df.drop(columns=[c for c in ['has_mobile_money','Target'] if c in df.columns])
    y = df['has_mobile_money']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model_train = XGBClassifier(n_estimators=100, random_state=42, eval_metric='logloss', verbosity=0)
    model_train.fit(X_train, y_train)
    os.makedirs(os.path.join(BASE_DIR, "models"), exist_ok=True)
    joblib.dump(model_train, MODEL_PATH)
    with open(FEATURES_PATH, 'w') as f:
        json.dump(X.columns.tolist(), f)
    print("✅ Model trained and saved!")

# ── Load model & features ──────────────────────────
model = joblib.load(MODEL_PATH)
with open(FEATURES_PATH) as f:
    feature_names