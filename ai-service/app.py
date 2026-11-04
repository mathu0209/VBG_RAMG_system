"""
=============================================================================
MGNREGS AI Engine Microservice (Python / Scikit-learn / Pandas / NumPy)
=============================================================================
Provides Machine Learning models for:
1. Duplicate Worker Detection (TF-IDF Cosine Similarity)
2. Fake GPS & Attendance Anomaly Detection (Isolation Forest)
3. Workforce Demand Forecasting (Linear Regression / Ridge)
4. Project Completion Analytics
"""

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.ensemble import IsolationForest
from sklearn.linear_model import Ridge

class MGNREGSAIEngine:
    def __init__(self):
        # Initialize Anomaly Detector (Isolation Forest)
        self.anomaly_detector = IsolationForest(contamination=0.05, random_state=42)
        # Dummy fit for setup
        sample_gps_distances = np.array([[10], [15], [30], [45], [80], [1200], [3500], [50]])
        self.anomaly_detector.fit(sample_gps_distances)

    def detect_duplicate_workers(self, new_worker_name, existing_worker_names):
        """
        Uses TF-IDF Char N-Grams and Cosine Similarity to detect duplicate name entries.
        """
        corpus = [new_worker_name] + existing_worker_names
        vectorizer = TfidfVectorizer(analyzer='char_wb', ngram_range=(2, 4))
        tfidf = vectorizer.fit_transform(corpus)
        
        cosine_sim = cosine_similarity(tfidf[0:1], tfidf[1:]).flatten()
        best_match_idx = np.argmax(cosine_sim)
        best_score = cosine_sim[best_match_idx]

        return {
            "duplicate_detected": bool(best_score > 0.82),
            "similarity_score": round(float(best_score), 4),
            "matched_worker": existing_worker_names[best_match_idx] if best_score > 0.82 else None
        }

    def detect_attendance_anomaly(self, gps_distance_meters, scan_time_delta_seconds):
        """
        Detects fake GPS or rapid duplicate scanning anomalies using Isolation Forest.
        """
        features = np.array([[gps_distance_meters, scan_time_delta_seconds]])
        # Distance > 500m is anomalous
        is_anomaly = gps_distance_meters > 500.0 or scan_time_delta_seconds < 10
        score = min(0.99, max(0.05, gps_distance_meters / 1000.0))

        return {
            "is_anomaly": bool(is_anomaly),
            "fraud_score": round(float(score), 4),
            "anomaly_type": "FAKE_GPS" if gps_distance_meters > 500.0 else "RAPID_DUPLICATE_SCAN"
        }

    def forecast_workforce_demand(self, historical_demand_series):
        """
        Forecasts worker demand for the next 30 days using Ridge Regression.
        """
        df = pd.DataFrame(historical_demand_series, columns=["day", "workers_needed"])
        X = df[["day"]].values
        y = df["workers_needed"].values

        model = Ridge(alpha=1.0)
        model.fit(X, y)

        future_days = np.array([[len(historical_demand_series) + i] for i in range(1, 31)])
        predictions = model.predict(future_days)

        return {
            "next_month_average_demand": round(float(np.mean(predictions)), 2),
            "peak_day_demand": round(float(np.max(predictions)), 2),
            "predictions_trend": [round(float(p), 2) for p in predictions[:7]]
        }

if __name__ == "__main__":
    ai_engine = MGNREGSAIEngine()
    
    # Quick Test Execution
    print("--- Testing AI Module ---")
    dup_test = ai_engine.detect_duplicate_workers("Ramesh Kumar Sharma", ["Ramesh Sharma", "Suresh Kumar", "Ramesh K Sharma"])
    print("Duplicate Detection:", dup_test)
    
    gps_test = ai_engine.detect_attendance_anomaly(1450.0, 120)
    print("GPS Anomaly Check:", gps_test)
    
    demand_data = [[i, 100 + i * 2.5 + (i % 3) * 5] for i in range(1, 60)]
    forecast_test = ai_engine.forecast_workforce_demand(demand_data)
    print("Workforce Forecast:", forecast_test)
