package com.disaster.Disaster_Management.analytics.controller;
import com.disaster.Disaster_Management.analytics.service.AnalyticsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/disasters")
    public Map<String, Object> getDisasterStats() {
        return analyticsService.getDisasterStats();
    }

    @GetMapping("/responders")
    public Map<String, Object> getResponderStats() {
        return analyticsService.getResponderStats();
    }

    @GetMapping("/response-times")
    public Map<String, Object> getResponseTimeStats() {
        return analyticsService.getResponseTimeStats();
    }

    @GetMapping("/alerts")
    public Map<String, Object> getAlertStats() {
        return analyticsService.getAlertStats();
    }
}