package com.mgnregs.repository;

import com.mgnregs.entity.WorkAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkAllocationRepository extends JpaRepository<WorkAllocation, Long> {
    List<WorkAllocation> findByWorkerId(Long workerId);
    List<WorkAllocation> findByProjectId(Long projectId);
    List<WorkAllocation> findByWorkerIdAndStatus(Long workerId, String status);
}
