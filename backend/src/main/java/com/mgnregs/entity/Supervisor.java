package com.mgnregs.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "supervisors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Supervisor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "panchayat_id", nullable = false)
    private Panchayat panchayat;

    @Column(nullable = false)
    private String phone;
}
