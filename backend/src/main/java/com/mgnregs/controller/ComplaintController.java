package com.mgnregs.controller;

import com.mgnregs.entity.Complaint;
import com.mgnregs.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/complaints")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ComplaintController {

    private final ComplaintService complaintService;

    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @PostMapping
    public ResponseEntity<Complaint> registerComplaint(@RequestBody Complaint complaint) {
        return ResponseEntity.ok(complaintService.registerComplaint(complaint));
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<Complaint> resolveComplaint(@PathVariable Long id, @RequestParam String resolutionDetails) {
        return ResponseEntity.ok(complaintService.resolveComplaint(id, resolutionDetails));
    }
}
