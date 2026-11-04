package com.mgnregs.repository;

import com.mgnregs.entity.Panchayat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PanchayatRepository extends JpaRepository<Panchayat, Long> {
    Optional<Panchayat> findByPanchayatCode(String panchayatCode);
    List<Panchayat> findByBlockId(Long blockId);
}
