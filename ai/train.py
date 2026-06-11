import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import pickle, json

df = pd.read_csv("Training.csv")
X = df.drop("prognosis", axis=1)
y = df["prognosis"]

symptom_columns = list(X.columns)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

print(f"Accuracy: {accuracy_score(y_test, model.predict(X_test)):.2%}")
print(classification_report(y_test, model.predict(X_test)))

pickle.dump(model, open("model.pkl", "wb"))
json.dump(symptom_columns, open("symptoms.json", "w"))
print("Done — model.pkl and symptoms.json saved.")