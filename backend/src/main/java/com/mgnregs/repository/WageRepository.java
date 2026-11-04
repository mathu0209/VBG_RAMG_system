package com.mgnregs.repository;

import com.mgnregs.entity.Wage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WageRepository extends JpaRepository<Wage, Long> {
    List<Wage> findByWorkerId(Long workerId);
    List<Wage> findByProjectId(Long projectId);
    List<Wage> findByStatus(String status);
}
