package com.mgnregs.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class FraudDetectionService {

    public Map<String, Object> evaluateWorkerFraudRisk(
            String workerId, 
            boolean faceMatched, 
            double gpsDistanceMeters, 
            int scansInShortWindow, 
            double wageDevPercent
    ) {
        int riskScore = 0;
        List<Map<String, String>> riskFactors = new ArrayList<>();

        // Factor 1: Face Mismatch
        if (!faceMatched) {
            riskScore += 35;
            Map<String, String> f1 = new HashMap<>();
            f1.put("factor", "Face Mismatch");
            f1.put("description", "Facial verification confidence below required threshold (Detected match: 42%)");
            f1.put("timestamp", new Date().toString());
            riskFactors.add(f1);
        }

        // Factor 2: Location Mismatch
        if (gpsDistanceMeters > 500.0) {
            riskScore += 30;
            Map<String, String> f2 = new HashMap<>();
            f2.put("factor", "Location Mismatch");
            f2.put("description", "Distance from worksite: " + String.format("%.0f", gpsDistanceMeters) + " m");
            f2.put("timestamp", new Date().toString());
            riskFactors.add(f2);
        }

        // Factor 3: Unusual Attendance Pattern
        if (scansInShortWindow > 1) {
            riskScore += 20;
            Map<String, String> f3 = new HashMap<>();
            f3.put("factor", "Unusual Attendance Pattern");
            f3.put("description", "Multiple attendance entries recorded in short timeframe (" + scansInShortWindow + " scans)");
            f3.put("timestamp", new Date().toString());
            riskFactors.add(f3);
        }

        // Factor 4: Payment Anomaly
        if (wageDevPercent > 30.0) {
            riskScore += 15;
            Map<String, String> f4 = new HashMap<>();
            f4.put("factor", "Payment Anomaly");
            f4.put("description", "Higher payment compared to similar workers (+ " + String.format("%.1f", wageDevPercent) + "% deviation)");
            f4.put("timestamp", new Date().toString());
            riskFactors.add(f4);
        }

        riskScore = Math.min(100, riskScore);
        String riskLevel = riskScore >= 70 ? "HIGH" : riskScore >= 40 ? "MEDIUM" : "LOW";
        String recommendedAction = riskScore >= 70 ? "Flag for Block Officer Review & Hold Payment" : riskScore >= 40 ? "Request Supervisor Re-Verification" : "Approved for Processing";

        Map<String, Object> result = new HashMap<>();
        result.put("workerId", workerId);
        result.put("riskScore", riskScore);
        result.put("riskLevel", riskLevel);
        result.put("riskFactors", riskFactors);
        result.put("recommendedAction", recommendedAction);
        result.put("workflowState", "FLAGGED_FOR_REVIEW");
        result.put("evaluatedAt", new Date());

        return result;
    }
}
