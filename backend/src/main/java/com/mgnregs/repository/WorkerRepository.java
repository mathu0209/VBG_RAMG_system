package com.mgnregs.repository;

import com.mgnregs.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long> {
    Optional<Worker> findByJobCardNumber(String jobCardNumber);
    List<Worker> findByAadhaarHash(String aadhaarHash);
    List<Worker> findByBankAccountNumber(String bankAccountNumber);
    List<Worker> findByVillageId(Long villageId);
    List<Worker> findByVerificationStatus(String status);
}
