package com.mgnregs.service;

import com.mgnregs.entity.Complaint;
import com.mgnregs.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public Complaint registerComplaint(Complaint complaint) {
        if (complaint.getComplaintNumber() == null) {
            complaint.setComplaintNumber("CMP-" + (System.currentTimeMillis() % 1000000));
        }
        return complaintRepository.save(complaint);
    }

    public Complaint resolveComplaint(Long id, String resolutionDetails) {
        Complaint c = complaintRepository.findById(id).orElseThrow();
        c.setStatus("RESOLVED");
        c.setResolutionDetails(resolutionDetails);
        return complaintRepository.save(c);
    }
}
