package com.mgnregs.repository;

import com.mgnregs.entity.FraudReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FraudReportRepository extends JpaRepository<FraudReport, Long> {
    List<FraudReport> findBySeverity(String severity);
    List<FraudReport> findByStatus(String status);
}
