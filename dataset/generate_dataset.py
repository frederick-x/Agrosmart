"""Builds dataset/crop_recommendation.csv (2200 rows, 22 crops, 100 each).
The values are SYNTHETIC: sampled around the typical per-crop averages of the public Kaggle
'Crop Recommendation Dataset' (Atharva Ingle). For best results, download the real CSV from Kaggle and
replace this file (same columns: N,P,K,temperature,humidity,ph,rainfall,label)."""
import os
import numpy as np
import pandas as pd

# label: N, P, K, temp, humidity, ph, rainfall (means)
MEANS = {
 "rice": (80, 48, 40, 23.7, 82, 6.4, 236), "maize": (78, 48, 20, 22.4, 65, 6.2, 85),
 "chickpea": (40, 68, 80, 18.9, 17, 7.3, 80), "kidneybeans": (21, 68, 20, 20, 21, 5.7, 105),
 "pigeonpeas": (21, 68, 20, 27.7, 48, 5.8, 149), "mothbeans": (21, 48, 20, 28.2, 53, 6.8, 51),
 "mungbean": (21, 48, 20, 28.5, 85, 6.7, 48), "blackgram": (40, 67, 19, 30, 65, 7.1, 68),
 "lentil": (19, 68, 20, 25, 65, 6.9, 46), "pomegranate": (19, 19, 40, 21.8, 90, 6.4, 108),
 "banana": (100, 82, 50, 27.4, 80, 6.0, 105), "mango": (20, 27, 30, 31.2, 50, 5.8, 95),
 "grapes": (23, 132, 200, 23.8, 82, 6.0, 69), "watermelon": (99, 17, 50, 25.6, 85, 6.5, 50),
 "muskmelon": (100, 17, 50, 28.7, 92, 6.4, 25), "apple": (21, 134, 200, 22.6, 92, 5.9, 113),
 "orange": (20, 16, 10, 22.8, 92, 7.0, 110), "papaya": (50, 59, 50, 33.7, 92, 6.7, 143),
 "coconut": (22, 17, 31, 27.4, 95, 6.0, 175), "cotton": (118, 46, 20, 24, 80, 6.9, 80),
 "jute": (78, 46, 40, 25, 80, 6.7, 175), "coffee": (101, 29, 30, 25.5, 58, 6.8, 158),
}
rng = np.random.default_rng(42)
rows = []
for label, (n, p, k, t, h, ph, r) in MEANS.items():
    for _ in range(100):
        rows.append([
            max(0, rng.normal(n, max(3, n * 0.12))), max(0, rng.normal(p, max(3, p * 0.12))),
            max(0, rng.normal(k, max(3, k * 0.12))), rng.normal(t, 1.5),
            float(np.clip(rng.normal(h, 3.5), 10, 100)), float(np.clip(rng.normal(ph, 0.35), 3.5, 9.9)),
            max(10, rng.normal(r, max(5, r * 0.2))), label])
df = pd.DataFrame(rows, columns=["N", "P", "K", "temperature", "humidity", "ph", "rainfall", "label"]).round(2)
df = df.sample(frac=1, random_state=1).reset_index(drop=True)
df.to_csv(os.path.join(os.path.dirname(__file__), "crop_recommendation.csv"), index=False)
print("Saved", df.shape)
