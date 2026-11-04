package com.mgnregs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "villages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Village {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "village_code", unique = true, nullable = false)
    private String villageCode;

    @Column(name = "village_name", nullable = false)
    private String villageName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "panchayat_id", nullable = false)
    private Panchayat panchayat;

    @Builder.Default
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
