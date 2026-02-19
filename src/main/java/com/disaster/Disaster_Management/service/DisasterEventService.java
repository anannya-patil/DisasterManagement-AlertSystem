package com.disaster.Disaster_Management.service;

import com.disaster.Disaster_Management.entity.*;
import com.disaster.Disaster_Management.repository.DisasterEventRepository;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DisasterEventService {

    private final DisasterEventRepository repository;

    public DisasterEventService(DisasterEventRepository repository) {
        this.repository = repository;
    }

    // 🔹 Public filtering with pagination
    public Page<DisasterEvent> getFilteredDisasters(
            DisasterType type,
            SeverityLevel severity,
            String location,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Boolean liveOnly,
            Double minMagnitude,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("eventTime").descending());

        Specification<DisasterEvent> spec = Specification.where(null);

        if (type != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("disasterType"), type));
        }

        if (severity != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("severity"), severity));
        }

        if (location != null && !location.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("locationName")),
                            "%" + location.toLowerCase() + "%"));
        }

        if (startDate != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("eventTime"), startDate));
        }

        if (endDate != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("eventTime"), endDate));
        }

        if (Boolean.TRUE.equals(liveOnly)) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("status"), DisasterStatus.VERIFIED));
        }

        if (minMagnitude != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("magnitude"), minMagnitude));
        }

        return repository.findAll(spec, pageable);
    }

    // 🔹 Admin Approve
    public DisasterEvent approve(Long id, String adminEmail) {
        DisasterEvent event = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disaster not found"));

        event.setStatus(DisasterStatus.VERIFIED);
        event.setApprovedBy(adminEmail);
        event.setApprovedAt(LocalDateTime.now());

        return repository.save(event);
    }

    // 🔹 Admin Reject
    public DisasterEvent reject(Long id) {
        DisasterEvent event = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disaster not found"));

        event.setStatus(DisasterStatus.REJECTED);
        return repository.save(event);
    }

    // 🔹 Admin Resolve
    public DisasterEvent resolve(Long id) {
        DisasterEvent event = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disaster not found"));

        event.setStatus(DisasterStatus.RESOLVED);
        return repository.save(event);
    }

    // 🔹 Get Pending (Admin)
    public Page<DisasterEvent> getPending(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return repository.findAll(
                (root, query, cb) ->
                        cb.equal(root.get("status"), DisasterStatus.PENDING),
                pageable
        );
    }

    public DisasterEvent update(Long id, DisasterEvent updatedData) {

        DisasterEvent existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disaster not found"));

        existing.setTitle(updatedData.getTitle());
        existing.setDescription(updatedData.getDescription());
        existing.setDisasterType(updatedData.getDisasterType());
        existing.setSeverity(updatedData.getSeverity());
        existing.setLatitude(updatedData.getLatitude());
        existing.setLongitude(updatedData.getLongitude());
        existing.setLocationName(updatedData.getLocationName());
        existing.setSource(updatedData.getSource());
        existing.setMagnitude(updatedData.getMagnitude());
        existing.setEventTime(updatedData.getEventTime());

        return repository.save(existing);
    }

    //Auto-Verification for Critical Earthquakes
    @Scheduled(fixedRate = 60000)
    public void autoVerifyCriticalEarthquakes() {

        System.out.println("Auto verification check running at: " + LocalDateTime.now());

        List<DisasterEvent> events = repository.findAutoVerifiableEarthquakes();

        System.out.println("Matching events count: " + events.size());

        events.forEach(event -> {
            event.setStatus(DisasterStatus.VERIFIED);
            repository.save(event);
        });
    }
}