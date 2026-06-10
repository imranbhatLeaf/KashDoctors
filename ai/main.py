from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from predict import get_prediction, get_all_symptoms
from disease_map import DISEASE_SPECIALITY
import os

load_dotenv()

app = FastAPI(title="Kashdocs AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class SymptomsRequest(BaseModel):
    symptoms: list[str]

@app.get("/")
def root():
    return {"status": "Kashdocs AI service running"}

@app.get("/symptoms")
def symptoms():
    return {"symptoms": get_all_symptoms()}

@app.post("/predict")
def predict(body: SymptomsRequest):
    if len(body.symptoms) < 2:
        raise HTTPException(status_code=400, detail="Provide at least 2 symptoms")

    result = get_prediction(body.symptoms)
    disease = result["disease"]
    speciality = DISEASE_SPECIALITY.get(disease, "General Physician")

    return {
        "disease": disease,
        "confidence": result["confidence"],
        "speciality": speciality,
        "top_predictions": result["top_predictions"]
    }