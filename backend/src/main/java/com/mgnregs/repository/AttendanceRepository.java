package com.mgnregs.repository;

import com.mgnregs.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByWorkerId(Long workerId);
    List<Attendance> findByProjectId(Long projectId);
    Optional<Attendance> findByWorkerIdAndProjectIdAndAttendanceDate(Long workerId, Long projectId, LocalDate attendanceDate);
    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);
    List<Attendance> findByFraudFlaggedTrue();
}
