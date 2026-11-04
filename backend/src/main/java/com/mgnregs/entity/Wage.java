package com.mgnregs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "wages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "total_days", nullable = false)
    private Integer totalDays;

    @Column(name = "daily_wage_rate", nullable = false)
    private BigDecimal dailyWageRate;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "wage_period_start", nullable = false)
    private LocalDate wagePeriodStart;

    @Column(name = "wage_period_end", nullable = false)
    private LocalDate wagePeriodEnd;

    @Builder.Default
    @Column(nullable = false)
    private String status = "GENERATED"; // GENERATED, APPROVED, PAID, REJECTED

    @Column(name = "payment_reference")
    private String paymentReference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_user_id")
    private User approvedBy;

    @Builder.Default
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
