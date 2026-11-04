package com.mgnregs;

import com.mgnregs.entity.*;
import com.mgnregs.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final StateRepository stateRepository;
    private final DistrictRepository districtRepository;
    private final BlockRepository blockRepository;
    private final PanchayatRepository panchayatRepository;
    private final VillageRepository villageRepository;
    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;
    private final SupervisorRepository supervisorRepository;
    private final ProjectRepository projectRepository;
    private final AttendanceRepository attendanceRepository;
    private final WageRepository wageRepository;
    private final ComplaintRepository complaintRepository;
    private final FraudReportRepository fraudReportRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (stateRepository.count() > 0) return;

        // 1. Seed State -> District -> Block -> Panchayat -> Village
        State state = stateRepository.save(State.builder().stateCode("KA").stateName("Karnataka").build());
        District district = districtRepository.save(District.builder().districtCode("BLR-R").districtName("Bengaluru Rural").state(state).build());
        Block block = blockRepository.save(Block.builder().blockCode("HOS").blockName("Hoskote").district(district).build());
        Panchayat panchayat = panchayatRepository.save(Panchayat.builder().panchayatCode("ANUG").panchayatName("Anugondanahalli").block(block).build());
        Village village = villageRepository.save(Village.builder().villageCode("MUT").villageName("Muthsandra").panchayat(panchayat).build());

        // 2. Seed Users for 7 Roles
        String password = passwordEncoder.encode("admin123");

        User admin = userRepository.save(User.builder()
                .username("superadmin")
                .password(password)
                .fullName("Super Admin Officer")
                .email("superadmin@mgnregs.gov.in")
                .phone("9876543210")
                .role(Role.SUPER_ADMIN)
                .build());

        User stateAdmin = userRepository.save(User.builder()
                .username("stateadmin")
                .password(password)
                .fullName("State Admin Karnataka")
                .email("stateadmin@mgnregs.gov.in")
                .phone("9876543211")
                .role(Role.STATE_ADMIN)
                .state(state)
                .build());

        User supervisorUser = userRepository.save(User.builder()
                .username("supervisor")
                .password(password)
                .fullName("Ramesh Kumar (Supervisor)")
                .email("supervisor@mgnregs.gov.in")
                .phone("9876543212")
                .role(Role.SUPERVISOR)
                .panchayat(panchayat)
                .build());

        Supervisor supervisor = supervisorRepository.save(Supervisor.builder()
                .user(supervisorUser)
                .panchayat(panchayat)
                .phone("9876543212")
                .build());

        // 3. Seed Workers
        Worker w1 = workerRepository.save(Worker.builder()
                .jobCardNumber("KA-01-002-004-001/102")
                .fullName("Basavaraj Gowda")
                .gender("MALE")
                .dob(LocalDate.of(1985, 4, 12))
                .aadhaarHash("9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08")
                .bankAccountNumber("384910294812")
                .ifscCode("SBIN0001234")
                .village(village)
                .category("OBC")
                .verificationStatus("VERIFIED")
                .qrCodeData("MGNREGS|WORKER|KA-01-002-004-001/102|9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08")
                .build());

        Worker w2 = workerRepository.save(Worker.builder()
                .jobCardNumber("KA-01-002-004-001/103")
                .fullName("Lakshmi Devi")
                .gender("FEMALE")
                .dob(LocalDate.of(1990, 8, 22))
                .aadhaarHash("a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3")
                .bankAccountNumber("492019385012")
                .ifscCode("CNRB0002345")
                .village(village)
                .category("SC")
                .verificationStatus("VERIFIED")
                .qrCodeData("MGNREGS|WORKER|KA-01-002-004-001/103|a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3")
                .build());

        // 4. Seed Projects (GIS coordinates)
        Project p1 = projectRepository.save(Project.builder()
                .projectCode("PRJ-KA-HOS-001")
                .title("Muthsandra Lake Desilting & Bund Construction")
                .description("Deepening community lake bed and reinforcing watershed bunds for rainwater harvesting.")
                .workType("WATER_CONSERVATION")
                .estimatedCost(new BigDecimal("450000.00"))
                .sanctionedDays(100)
                .village(village)
                .latitude(12.9642)
                .longitude(77.7815)
                .status("IN_PROGRESS")
                .supervisor(supervisor)
                .startDate(LocalDate.now().minusDays(15))
                .build());

        Project p2 = projectRepository.save(Project.builder()
                .projectCode("PRJ-KA-HOS-002")
                .title("Anugondanahalli Feeder Canal Drainage Clearing")
                .description("Clearing invasive weeds and widening storm drainage runoff channels.")
                .workType("DREDGING")
                .estimatedCost(new BigDecimal("280000.00"))
                .sanctionedDays(60)
                .village(village)
                .latitude(12.9710)
                .longitude(77.7890)
                .status("IN_PROGRESS")
                .supervisor(supervisor)
                .startDate(LocalDate.now().minusDays(5))
                .build());

        // 5. Seed Attendance
        attendanceRepository.save(Attendance.builder()
                .worker(w1)
                .project(p1)
                .attendanceDate(LocalDate.now())
                .status("PRESENT")
                .latitude(12.9643)
                .longitude(77.7816)
                .gpsVerified(true)
                .fraudFlagged(false)
                .supervisor(supervisor)
                .build());

        // 6. Seed Fraud Alert
        fraudReportRepository.save(FraudReport.builder()
                .alertCode("ALT-GPS-9912")
                .anomalyType("FAKE_GPS")
                .severity("HIGH")
                .description("Worker QR scanned 3.8 km outside project radius boundary.")
                .worker(w2)
                .project(p1)
                .confidenceScore(0.92)
                .status("OPEN")
                .build());

        // 7. Seed Complaints
        complaintRepository.save(Complaint.builder()
                .complaintNumber("CMP-2026-0811")
                .complainantName("Manjunath R.")
                .complainantPhone("9845012345")
                .category("WAGE_DELAY")
                .description("Wage for fortnight ending July 15 has not been credited to bank account yet.")
                .panchayat(panchayat)
                .status("PENDING")
                .build());

        System.out.println(">>> MGNREGS Seed Data Successfully Initialized! Default Admin User: 'superadmin' / 'admin123'");
    }
}
