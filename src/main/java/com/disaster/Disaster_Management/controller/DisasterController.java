package com.disaster.Disaster_Management.controller;

import com.disaster.Disaster_Management.entity.*;
import com.disaster.Disaster_Management.service.DisasterEventService;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/disasters")
@PreAuthorize("isAuthenticated()")
public class DisasterController {

    private final DisasterEventService service;

    public DisasterController(DisasterEventService service) {
        this.service = service;
    }

    @GetMapping
    public Page<DisasterEvent> getDisasters(
            @RequestParam(required = false) DisasterType type,
            @RequestParam(required = false) SeverityLevel severity,
            @RequestParam(required = false) String location,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime startDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime endDate,
            @RequestParam(required = false) Boolean liveOnly,
            @RequestParam(required = false) Double minMagnitude,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        return service.getFilteredDisasters(
                type,
                severity,
                location,
                startDate,
                endDate,
                liveOnly,
                minMagnitude,
                page,
                size
        );
    }
}