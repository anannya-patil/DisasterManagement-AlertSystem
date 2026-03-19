package com.disaster.Disaster_Management.controller;

import com.disaster.Disaster_Management.disaster.emergency.entity.EmergencyRequest;
import com.disaster.Disaster_Management.disaster.emergency.service.EmergencyRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/responder")
public class ResponderEmergencyController {

    private final EmergencyRequestService emergencyService;

    public ResponderEmergencyController(EmergencyRequestService emergencyService) {
        this.emergencyService = emergencyService;
    }

    // =====================================
    // GET: View Assigned Emergency Requests
    // =====================================
    @GetMapping("/emergency-requests")
    public ResponseEntity<List<EmergencyRequest>> getAssignedRequests() {
        return ResponseEntity.ok(emergencyService.getAssignedRequestsForResponder());
    }

    @PutMapping("/emergency-requests/{id}")
    public ResponseEntity<EmergencyRequest> updateStatus(
            @PathVariable Long id,
            @RequestParam String status)
    {
        return ResponseEntity.ok(emergencyService.updateRequestStatus(id, status));
    }
}