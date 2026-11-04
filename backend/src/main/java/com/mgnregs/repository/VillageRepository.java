package com.mgnregs.repository;

import com.mgnregs.entity.Village;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VillageRepository extends JpaRepository<Village, Long> {
    Optional<Village> findByVillageCode(String villageCode);
    List<Village> findByPanchayatId(Long panchayatId);
}
