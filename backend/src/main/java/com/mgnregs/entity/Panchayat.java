package com.mgnregs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "panchayats")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Panchayat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "panchayat_code", unique = true, nullable = false)
    private String panchayatCode;

    @Column(name = "panchayat_name", nullable = false)
    private String panchayatName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "block_id", nullable = false)
    private Block block;

    @Builder.Default
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
