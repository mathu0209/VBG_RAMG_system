package com.mgnregs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fraud_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraudReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "alert_code", unique = true, nullable = false)
    private String alertCode;

    @Column(name = "anomaly_type", nullable = false)
    private String anomalyType; // DUPLICATE_ATTENDANCE, FAKE_GPS, DUPLICATE_WORKER, SUSPICIOUS_WAGE, UNUSUAL_PATTERN

    @Column(nullable = false)
    private String severity; // HIGH, MEDIUM, LOW

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id")
    private Worker worker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attendance_id")
    private Attendance attendance;

    @Column(name = "confidence_score", nullable = false)
    private Double confidenceScore;

    @Builder.Default
    @Column(nullable = false)
    private String status = "OPEN"; // OPEN, INVESTIGATING, DISMISSED, ACTION_TAKEN

    @Builder.Default
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
