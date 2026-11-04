package com.mgnregs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "workers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_card_number", unique = true, nullable = false)
    private String jobCardNumber;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private LocalDate dob;

    @Column(name = "aadhaar_hash", nullable = false)
    private String aadhaarHash;

    @Column(name = "bank_account_number", nullable = false)
    private String bankAccountNumber;

    @Column(name = "ifsc_code", nullable = false)
    private String ifscCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "village_id", nullable = false)
    private Village village;

    @Column(nullable = false)
    private String category; // SC, ST, OBC, GENERAL

    @Builder.Default
    @Column(name = "verification_status")
    private String verificationStatus = "VERIFIED"; // PENDING, VERIFIED, REJECTED

    @Column(name = "qr_code_data", columnDefinition = "TEXT")
    private String qrCodeData;

    @Builder.Default
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
