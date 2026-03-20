package com.disaster.Disaster_Management.analytics.service;

import com.disaster.Disaster_Management.disaster.rescue.repository.RescueTaskRepository;
import com.disaster.Disaster_Management.disaster.incident.repository.IncidentReportRepository;
import com.disaster.Disaster_Management.disaster.alert.repository.AlertRepository;
import com.disaster.Disaster_Management.repository.DisasterEventRepository;
import com.disaster.Disaster_Management.disaster.common.TaskStatus;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AnalyticsService {

    private final DisasterEventRepository disasterRepo;
    private final RescueTaskRepository rescueRepo;
    private final IncidentReportRepository reportRepo;
    private final AlertRepository alertRepo;

    public AnalyticsService(
            DisasterEventRepository disasterRepo,
            RescueTaskRepository rescueRepo,
            IncidentReportRepository reportRepo,
            AlertRepository alertRepo
    ) {
        this.disasterRepo = disasterRepo;
        this.rescueRepo = rescueRepo;
        this.reportRepo = reportRepo;
        this.alertRepo = alertRepo;
    }

    // =========================
    // 1. DISASTER STATS
    // =========================
    public Map<String, Object> getDisasterStats() {
        Map<String, Object> result = new HashMap<>();

        result.put("total", disasterRepo.count());
        result.put("byType", disasterRepo.countByType());
        result.put("byRegion", disasterRepo.countByRegion());
        result.put("monthly", disasterRepo.countByMonth());

        return result;
    }

    // =========================
    // 2. RESPONDER PERFORMANCE
    // =========================
    public Map<String, Object> getResponderStats() {
        Map<String, Object> result = new HashMap<>();

        long totalTasks = rescueRepo.count();
        long completed = rescueRepo.countByTaskStatus(TaskStatus.COMPLETED);

        result.put("totalTasks", totalTasks);
        result.put("completedTasks", completed);
        result.put("completionRate",
                totalTasks == 0 ? 0 : (completed * 100.0 / totalTasks));

        result.put("reports", reportRepo.count());

        return result;
    }

    // =========================
    // 3. RESPONSE TIME
    // =========================
    public Map<String, Object> getResponseTimeStats() {
        Map<String, Object> result = new HashMap<>();

        List<Double> times = rescueRepo.calculateResponseTimes();

        if (times.isEmpty()) {
            result.put("average", 0);
            result.put("min", 0);
            result.put("max", 0);
            return result;
        }

        double avg = times.stream().mapToDouble(Double::doubleValue).average().orElse(0);
        double min = Collections.min(times);
        double max = Collections.max(times);

        result.put("average", avg);
        result.put("min", min);
        result.put("max", max);

        return result;
    }

    // =========================
    // 4. ALERT STATS
    // =========================
    public Map<String, Object> getAlertStats() {
        Map<String, Object> result = new HashMap<>();

        long total = alertRepo.count();
        long active = alertRepo.countActiveAlerts();

        result.put("total", total);
        result.put("acknowledged", active);
        result.put("ignored", total - active);

        return result;
    }
}