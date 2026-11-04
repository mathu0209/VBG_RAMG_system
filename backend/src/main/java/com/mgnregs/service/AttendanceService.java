package com.mgnregs.service;

import com.mgnregs.entity.Attendance;
import com.mgnregs.entity.FraudReport;
import com.mgnregs.entity.Project;
import com.mgnregs.repository.AttendanceRepository;
import com.mgnregs.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final ProjectRepository projectRepository;
    private final AiService aiService;

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public Attendance recordAttendance(Attendance attendance) {
        attendance.setScannedAt(LocalDateTime.now());
        
        Project project = projectRepository.findById(attendance.getProject().getId()).orElseThrow();
        
        // AI GPS Proximity Check
        boolean isGpsValid = aiService.verifyGpsProximity(
                project.getLatitude(), project.getLongitude(),
                attendance.getLatitude(), attendance.getLongitude()
        );
        
        attendance.setGpsVerified(isGpsValid);
        attendance.setFraudFlagged(!isGpsValid);

        Attendance saved = attendanceRepository.save(attendance);

        if (!isGpsValid) {
            aiService.evaluateAttendanceAnomaly(saved, project);
        }

        return saved;
    }
}
