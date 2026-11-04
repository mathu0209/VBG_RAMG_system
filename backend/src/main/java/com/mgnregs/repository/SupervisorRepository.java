package com.mgnregs.repository;

import com.mgnregs.entity.Supervisor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SupervisorRepository extends JpaRepository<Supervisor, Long> {
    Optional<Supervisor> findByUserId(Long userId);
    List<Supervisor> findByPanchayatId(Long panchayatId);
}
