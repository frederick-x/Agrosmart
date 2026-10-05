"""Trains the Random Forest crop model.   Run from backend folder:  python ml/train_model.py"""
import os
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split

HERE = os.path.dirname(os.path.abspath(__file__))
CSV = os.path.join(HERE, "..", "..", "dataset", "crop_recommendation.csv")
FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]

# 1. Load
df = pd.read_csv(CSV)
print("Rows, columns:", df.shape)

# 2-4. Clean + check missing values + basic preprocessing
df = df.drop_duplicates().dropna()
df["label"] = df["label"].str.strip().str.lower()
print("Missing values:\n", df.isnull().sum().to_string())
print("Crops:", df["label"].nunique())
# Random Forest is not distance based, so feature scaling is NOT needed (no scaler saved).

# 5. Features / target
X, y = df[FEATURES], df["label"]

# 6. Split
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# 7. Train
model = RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1)
model.fit(X_tr, y_tr)

# 8-9. Evaluate
pred = model.predict(X_te)
acc = accuracy_score(y_te, pred)
report = classification_report(y_te, pred)
cm = pd.DataFrame(confusion_matrix(y_te, pred, labels=model.classes_), index=model.classes_, columns=model.classes_)
print(f"\nTest accuracy: {acc * 100:.2f}%\n{report}")
imp = pd.Series(model.feature_importances_, index=FEATURES).sort_values(ascending=False)
print("Feature importance:\n", imp.round(3).to_string())
with open(os.path.join(HERE, "model_report.txt"), "w", encoding="utf8") as f:
    f.write(f"Test accuracy: {acc * 100:.2f}%\n\n{report}\nConfusion matrix:\n{cm.to_string()}\n")

# 10. Save (humidity range per crop is used for the 'suitable humidity' explanation)
hum = df.groupby("label")["humidity"].quantile([0.05, 0.95]).unstack()
bundle = {"model": model, "features": FEATURES, "accuracy": acc,
          "humidity_range": {k: (float(r[0.05]), float(r[0.95])) for k, r in hum.iterrows()}}
joblib.dump(bundle, os.path.join(HERE, "crop_model.pkl"))
print("Saved ml/crop_model.pkl")
