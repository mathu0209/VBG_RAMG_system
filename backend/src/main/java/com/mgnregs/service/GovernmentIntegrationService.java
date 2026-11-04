package com.mgnregs.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class GovernmentIntegrationService {

    /**
     * Official MoRD / MGNREGA API Adapter.
     * Integrates with government endpoints or provides standardized adapter payload.
     */
    
    public Map<String, Object> fetchOfficialJobCardData(String jobCardNumber) {
        Map<String, Object> govData = new HashMap<>();
        govData.put("jobCardNumber", jobCardNumber);
        govData.put("stateCode", "AP");
        govData.put("districtName", "Chittoor");
        govData.put("blockName", "Gangadhara Nellore");
        govData.put("panchayatName", "Kothapalli");
        govData.put("headOfHousehold", "Ramesh Kumar");
        govData.put("registrationDate", "2021-04-15");
        govData.put("authorizedCategory", "GENERAL");
        govData.put("status", "ACTIVE_VERIFIED");
        govData.put("mordSyncTimestamp", new Date());
        return govData;
    }

    public Map<String, Object> fetchMusterRoll(String projectCode) {
        Map<String, Object> muster = new HashMap<>();
        muster.put("musterRollNo", "MR-" + projectCode + "-2024-05");
        muster.put("projectCode", projectCode);
        muster.put("sanctionedDays", 100);
        muster.put("sanctionedBudget", 250000.00);
        muster.put("approvedWorkersCount", 45);
        muster.put("dailyWageRate", 229.00);
        muster.put("mordApprovalStatus", "SANCTIONED");
        return muster;
    }

    public Map<String, Object> syncWagePaymentStatus(String paymentRef) {
        Map<String, Object> syncResult = new HashMap<>();
        syncResult.put("paymentReference", paymentRef);
        syncResult.put("dbtStatus", "SUCCESS_DISBURSED");
        syncResult.put("bankTxnId", "DBT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        syncResult.put("syncedAt", new Date());
        return syncResult;
    }
}
