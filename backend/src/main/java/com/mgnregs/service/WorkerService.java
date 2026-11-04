package com.mgnregs.service;

import com.mgnregs.entity.Worker;
import com.mgnregs.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final AiService aiService;

    public List<Worker> getAllWorkers() {
        return workerRepository.findAll();
    }

    public Optional<Worker> getWorkerById(Long id) {
        return workerRepository.findById(id);
    }

    public Map<String, Object> registerWorker(Worker worker) {
        // Generate QR Data Payload
        if (worker.getJobCardNumber() == null || worker.getJobCardNumber().isEmpty()) {
            worker.setJobCardNumber("JC-" + (System.currentTimeMillis() % 1000000));
        }
        worker.setQrCodeData("MGNREGS|WORKER|" + worker.getJobCardNumber() + "|" + worker.getAadhaarHash());

        // Run AI Duplicate Detection
        List<Worker> existing = workerRepository.findAll();
        Map<String, Object> aiResult = aiService.analyzeDuplicateWorker(worker, existing);

        Worker saved = workerRepository.save(worker);
        
        aiResult.put("worker", saved);
        return aiResult;
    }

    public Worker updateVerificationStatus(Long id, String status) {
        Worker w = workerRepository.findById(id).orElseThrow();
        w.setVerificationStatus(status);
        return workerRepository.save(w);
    }

    public void deleteWorker(Long id) {
        workerRepository.deleteById(id);
    }
}
