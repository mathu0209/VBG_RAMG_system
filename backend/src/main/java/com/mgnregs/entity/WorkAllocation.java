package com.mgnregs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "work_allocations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "allocated_from", nullable = false)
    private LocalDate allocatedFrom;

    @Column(name = "allocated_to", nullable = false)
    private LocalDate allocatedTo;

    @Builder.Default
    @Column(nullable = false)
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, REALLOCATED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "allocated_by_user_id")
    private User allocatedBy;

    @Builder.Default
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
