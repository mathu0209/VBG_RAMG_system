package com.mgnregs.service;

import com.mgnregs.entity.Attendance;
import com.mgnregs.entity.FraudReport;
import com.mgnregs.entity.Project;
import com.mgnregs.entity.Worker;
import com.mgnregs.repository.FraudReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AiService {

    private final FraudReportRepository fraudReportRepository;

    // Haversine formula to calculate distance between two GPS points in Meters
    public double calculateDistanceMeters(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000; // Convert to meters
    }

    // AI Feature 1: Fake GPS Detection
    public boolean verifyGpsProximity(double projLat, double projLng, double scanLat, double scanLng) {
        double distance = calculateDistanceMeters(projLat, projLng, scanLat, scanLng);
        return distance <= 500.0; // Allowed radius: 500 meters
    }

    // AI Feature 2: Duplicate Worker & Identity Fraud Detection
    public Map<String, Object> analyzeDuplicateWorker(Worker newWorker, List<Worker> existingWorkers) {
        Map<String, Object> result = new HashMap<>();
        boolean isDuplicate = false;
        double maxSimilarity = 0.0;
        String matchReason = "";

        for (Worker existing : existingWorkers) {
            if (existing.getId().equals(newWorker.getId())) continue;

            // Check exact hash matches
            if (existing.getAadhaarHash().equalsIgnoreCase(newWorker.getAadhaarHash())) {
                isDuplicate = true;
                maxSimilarity = 1.0;
                matchReason = "Exact Aadhaar Hash Match with " + existing.getJobCardNumber();
                break;
            }
            if (existing.getBankAccountNumber().equalsIgnoreCase(newWorker.getBankAccountNumber())) {
                isDuplicate = true;
                maxSimilarity = 0.95;
                matchReason = "Duplicate Bank Account Number with " + existing.getJobCardNumber();
                break;
            }

            // Name similarity check
            double nameSim = calculateSimilarity(existing.getFullName(), newWorker.getFullName());
            if (nameSim > 0.85 && existing.getVillage().getId().equals(newWorker.getVillage().getId())) {
                isDuplicate = true;
                maxSimilarity = nameSim;
                matchReason = "High Phonetic/Name Similarity (" + String.format("%.0f%%", nameSim * 100) + ") with " + existing.getFullName();
                break;
            }
        }

        result.put("isDuplicate", isDuplicate);
        result.put("confidenceScore", maxSimilarity);
        result.put("reason", matchReason);
        return result;
    }

    // AI Feature 3: Attendance Fraud & Anomaly Analysis
    public FraudReport evaluateAttendanceAnomaly(Attendance attendance, Project project) {
        double distance = calculateDistanceMeters(project.getLatitude(), project.getLongitude(), 
                                                 attendance.getLatitude(), attendance.getLongitude());
        
        if (distance > 500.0) {
            FraudReport report = FraudReport.builder()
                    .alertCode("ALT-GPS-" + System.currentTimeMillis() % 100000)
                    .anomalyType("FAKE_GPS")
                    .severity(distance > 2000 ? "HIGH" : "MEDIUM")
                    .description("Attendance recorded " + String.format("%.1f", distance) + "m away from designated project site (" + project.getTitle() + ").")
                    .worker(attendance.getWorker())
                    .project(project)
                    .attendance(attendance)
                    .confidenceScore(Math.min(0.99, distance / 1000.0))
                    .status("OPEN")
                    .build();
            return fraudReportRepository.save(report);
        }
        return null;
    }

    // AI Feature 4: Workforce Demand Forecasting
    public Map<String, Object> predictWorkforceDemand(int activeProjects, int currentWorkers) {
        int estimatedDemand = (int) Math.round(activeProjects * 28.5 + currentWorkers * 0.15);
        double peakProb = Math.min(0.95, 0.45 + (activeProjects * 0.08));
        
        Map<String, Object> forecast = new HashMap<>();
        forecast.put("predictedDemandWorkers", estimatedDemand);
        forecast.put("peakSeasonProbability", peakProb);
        forecast.put("recommendedSanctionBudget", estimatedDemand * 310 * 14); // 14 days @ ₹310/day
        forecast.put("forecastPeriod", "Next 30 Days");
        return forecast;
    }

    // AI Feature 5: Project Completion Prediction
    public Map<String, Object> predictProjectCompletion(Project project, int totalAttendanceLogged) {
        int targetDays = project.getSanctionedDays();
        double progressRatio = Math.min(1.0, (double) totalAttendanceLogged / (targetDays * 20)); // Assuming avg 20 workers
        int estDaysRemaining = (int) Math.max(1, Math.round(targetDays * (1 - progressRatio)));

        Map<String, Object> res = new HashMap<>();
        res.put("projectId", project.getId());
        res.put("projectTitle", project.getTitle());
        res.put("completionPercentage", Math.round(progressRatio * 100));
        res.put("estimatedDaysRemaining", estDaysRemaining);
        res.put("healthStatus", progressRatio > 0.6 ? "ON_SCHEDULE" : "DELAY_RISK");
        return res;
    }

    // Levenshtein Similarity helper
    private double calculateSimilarity(String s1, String s2) {
        String longer = s1.toLowerCase(), shorter = s2.toLowerCase();
        if (s1.length() < s2.length()) {
            longer = s2.toLowerCase(); shorter = s1.toLowerCase();
        }
        int longerLength = longer.length();
        if (longerLength == 0) return 1.0;
        return (longerLength - editDistance(longer, shorter)) / (double) longerLength;
    }

    private int editDistance(String s1, String s2) {
        int[] costs = new int[s2.length() + 1];
        for (int i = 0; i <= s1.length(); i++) {
            int lastValue = i;
            for (int j = 0; j <= s2.length(); j++) {
                if (i == 0) costs[j] = j;
                else {
                    if (j > 0) {
                        int newValue = costs[j - 1];
                        if (s1.charAt(i - 1) != s2.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0) costs[s2.length()] = lastValue;
        }
        return costs[s2.length()];
    }
}
