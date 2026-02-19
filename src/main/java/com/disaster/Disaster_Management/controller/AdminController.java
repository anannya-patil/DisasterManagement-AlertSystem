package com.disaster.Disaster_Management.controller;

import com.disaster.Disaster_Management.entity.User;
import com.disaster.Disaster_Management.entity.DisasterEvent;
import com.disaster.Disaster_Management.repository.UserRepository;
import com.disaster.Disaster_Management.service.DisasterEventService;

import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final DisasterEventService disasterService;

    public AdminController(UserRepository userRepository,
                           DisasterEventService disasterService) {
        this.userRepository = userRepository;
        this.disasterService = disasterService;
    }

    // ===========================
    // USER MANAGEMENT
    // ===========================

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return "User deleted successfully with id: " + id;
    }

    @GetMapping("/dashboard")
    public String adminDashboard() {
        return "Welcome Admin! You have full access to the system.";
    }

    // ===========================
    // DISASTER MANAGEMENT
    // ===========================

    // Get all pending disasters
    @GetMapping("/disasters/pending")
    public Page<DisasterEvent> getPending(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return disasterService.getPending(page, size);
    }

    // Approve disaster
    @PutMapping("/disasters/{id}/approve")
    public DisasterEvent approve(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String adminEmail = authentication.getName();
        return disasterService.approve(id, adminEmail);
    }

    // Reject disaster
    @PutMapping("/disasters/{id}/reject")
    public DisasterEvent reject(@PathVariable Long id) {
        return disasterService.reject(id);
    }

    // Resolve disaster
    @PutMapping("/disasters/{id}/resolve")
    public DisasterEvent resolve(@PathVariable Long id) {
        return disasterService.resolve(id);
    }

    //edit disaster
    @PutMapping("/disasters/{id}")
    public DisasterEvent updateDisaster(
            @PathVariable Long id,
            @RequestBody DisasterEvent updatedData
    ) {
        return disasterService.update(id, updatedData);
    }
}