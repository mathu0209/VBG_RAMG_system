package com.mgnregs.repository;

import com.mgnregs.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByProjectCode(String projectCode);
    List<Project> findByVillageId(Long villageId);
    List<Project> findBySupervisorId(Long supervisorId);
    List<Project> findByStatus(String status);
}
