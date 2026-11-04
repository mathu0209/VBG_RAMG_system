package com.mgnregs.repository;

import com.mgnregs.entity.Block;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BlockRepository extends JpaRepository<Block, Long> {
    Optional<Block> findByBlockCode(String blockCode);
    List<Block> findByDistrictId(Long districtId);
}
