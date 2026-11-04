package com.mgnregs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "complaint_number", unique = true, nullable = false)
    private String complaintNumber;

    @Column(name = "complainant_name", nullable = false)
    private String complainantName;

    @Column(name = "complainant_phone", nullable = false)
    private String complainantPhone;

    @Column(nullable = false)
    private String category; // WAGE_DELAY, ATTENDANCE_DISPUTE, JOB_CARD_ISSUE, CORRUPTION, POOR_WORK_SITE

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "panchayat_id", nullable = false)
    private Panchayat panchayat;

    @Builder.Default
    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, IN_INVESTIGATION, RESOLVED, REJECTED

    @Column(name = "resolution_details", columnDefinition = "TEXT")
    private String resolutionDetails;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_user_id")
    private User assignedTo;

    @Builder.Default
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
