package com.disaster.Disaster_Management.disaster.emergency.service;

import com.disaster.Disaster_Management.disaster.emergency.entity.EmergencyRequest;
import com.disaster.Disaster_Management.disaster.emergency.repository.EmergencyRequestRepository;
import com.disaster.Disaster_Management.entity.Role;
import com.disaster.Disaster_Management.entity.User;
import com.disaster.Disaster_Management.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmergencyRequestService {

    private final EmergencyRequestRepository emergencyRepository;
    private final UserRepository userRepository;

    public EmergencyRequestService(EmergencyRequestRepository emergencyRepository,
                                   UserRepository userRepository) {
        this.emergencyRepository = emergencyRepository;
        this.userRepository = userRepository;
    }

    // =====================================
    // CITIZEN: Submit Emergency Request
    // =====================================
    public EmergencyRequest createEmergencyRequest(String description,
                                                Double latitude,
                                                Double longitude,
                                                String region) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Object principal = authentication.getPrincipal();

        String citizenEmail;

        if (principal instanceof com.disaster.Disaster_Management.entity.User user) {
            citizenEmail = user.getEmail();
        } else {
            citizenEmail = principal.toString();
        }

        User citizen = userRepository.findByEmail(citizenEmail)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));

        EmergencyRequest request = new EmergencyRequest();
        request.setCitizenId(citizen.getId());
        request.setDescription(description);
        request.setLatitude(latitude);
        request.setLongitude(longitude);
        request.setRegion(region);
        request.setStatus("PENDING");

        assignResponder(request);

        return emergencyRepository.save(request);
    }

    // =====================================
    // ROUTING LOGIC
    // =====================================
    private void assignResponder(EmergencyRequest request) {

        List<User> responders = userRepository.findByRole(Role.RESPONDER)
                .stream()
                .filter(user -> user.getProfile() != null)
                .filter(user -> request.getRegion().equals(user.getProfile().getRegion()))
                .toList();

        if (!responders.isEmpty()) {
            User assignedResponder = responders.get(0);
            request.setAssignedResponderId(assignedResponder.getId());
            request.setStatus("ASSIGNED");
        }
    }

    // =====================================
    // RESPONDER: View Assigned Requests
    // =====================================
    public List<EmergencyRequest> getAssignedRequestsForResponder() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Object principal = authentication.getPrincipal();

        String responderEmail;

        if (principal instanceof com.disaster.Disaster_Management.entity.User user) {
            responderEmail = user.getEmail();
        } else {
            responderEmail = principal.toString();
        }

        User responder = userRepository.findByEmail(responderEmail)
                .orElseThrow(() -> new RuntimeException("Responder not found"));

        return emergencyRepository.findByAssignedResponderId(responder.getId());
    }

    public EmergencyRequest updateRequestStatus(Long requestId, String status)
    {
        EmergencyRequest request = emergencyRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(status);
        return emergencyRepository.save(request);
    }
}