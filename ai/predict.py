import pickle, json
import numpy as np

model = pickle.load(open("model.pkl", "rb"))
symptom_columns = json.load(open("symptoms.json"))

def get_prediction(symptoms: list[str]) -> dict:
    vector = [1 if s in symptoms else 0 for s in symptom_columns]
    disease = model.predict([vector])[0]
    proba = model.predict_proba([vector])[0]
    confidence = round(float(proba.max()) * 100, 1)

    # top 3 possible diseases with confidence
    top_indices = np.argsort(proba)[::-1][:3]
    top_predictions = [
        {"disease": model.classes_[i], "confidence": round(float(proba[i]) * 100, 1)}
        for i in top_indices if proba[i] > 0.05
    ]

    return {
        "disease": disease,
        "confidence": confidence,
        "top_predictions": top_predictions
    }

def get_all_symptoms() -> list[str]:
    return symptom_columns