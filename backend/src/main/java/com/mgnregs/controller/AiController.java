package com.mgnregs.controller;

import com.mgnregs.entity.FraudReport;
import com.mgnregs.repository.FraudReportRepository;
import com.mgnregs.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiController {

    private final AiService aiService;
    private final FraudReportRepository fraudReportRepository;

    @GetMapping("/fraud-alerts")
    public ResponseEntity<List<FraudReport>> getFraudAlerts() {
        return ResponseEntity.ok(fraudReportRepository.findAll());
    }

    @GetMapping("/predict-demand")
    public ResponseEntity<Map<String, Object>> predictWorkforceDemand(
            @RequestParam(defaultValue = "12") int activeProjects,
            @RequestParam(defaultValue = "350") int currentWorkers) {
        return ResponseEntity.ok(aiService.predictWorkforceDemand(activeProjects, currentWorkers));
    }
}
