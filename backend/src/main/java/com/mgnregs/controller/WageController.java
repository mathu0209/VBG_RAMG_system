package com.mgnregs.controller;

import com.mgnregs.entity.Wage;
import com.mgnregs.service.WageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WageController {

    private final WageService wageService;

    @GetMapping
    public ResponseEntity<List<Wage>> getAllWages() {
        return ResponseEntity.ok(wageService.getAllWages());
    }

    @PostMapping("/generate")
    public ResponseEntity<Wage> generateWage(@RequestBody Wage wage) {
        return ResponseEntity.ok(wageService.calculateAndGenerateWage(wage));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Wage> updateWageStatus(@PathVariable Long id, @RequestParam String status, @RequestParam(required = false) String paymentRef) {
        return ResponseEntity.ok(wageService.updateWageStatus(id, status, paymentRef));
    }
}
