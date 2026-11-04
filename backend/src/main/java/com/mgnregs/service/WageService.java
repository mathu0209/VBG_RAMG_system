package com.mgnregs.service;

import com.mgnregs.entity.Wage;
import com.mgnregs.repository.WageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WageService {

    private final WageRepository wageRepository;

    public List<Wage> getAllWages() {
        return wageRepository.findAll();
    }

    public Wage calculateAndGenerateWage(Wage wage) {
        if (wage.getDailyWageRate() == null) {
            wage.setDailyWageRate(new BigDecimal("310.00")); // Standard daily NREGA wage
        }
        wage.setTotalAmount(wage.getDailyWageRate().multiply(new BigDecimal(wage.getTotalDays())));
        wage.setStatus("GENERATED");
        return wageRepository.save(wage);
    }

    public Wage updateWageStatus(Long wageId, String status, String paymentRef) {
        Wage w = wageRepository.findById(wageId).orElseThrow();
        w.setStatus(status);
        if (paymentRef != null) {
            w.setPaymentReference(paymentRef);
        }
        return wageRepository.save(w);
    }
}
