package com.disaster.Disaster_Management.disaster.incident.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "incident_reports")
public class IncidentReport {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "rescue_task_id", nullable = false)
    private Long rescueTaskId;
    
    @Column(name = "responder_id", nullable = false)
    private Long responderId;
    
    @Column(name = "report_details", nullable = false, length = 2000)
    private String reportDetails;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(nullable = false)
    private Double latitude;
    
    @Column(nullable = false)
    private Double longitude;
    
    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;
    
    public IncidentReport() {}
    
    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getRescueTaskId() { return rescueTaskId; }
    public void setRescueTaskId(Long rescueTaskId) { this.rescueTaskId = rescueTaskId; }
    
    public Long getResponderId() { return responderId; }
    public void setResponderId(Long responderId) { this.responderId = responderId; }
    
    public String getReportDetails() { return reportDetails; }
    public void setReportDetails(String reportDetails) { this.reportDetails = reportDetails; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}