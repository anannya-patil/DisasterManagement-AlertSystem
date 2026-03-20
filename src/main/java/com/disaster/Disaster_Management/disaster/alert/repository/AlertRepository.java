package com.disaster.Disaster_Management.disaster.alert.repository;

import com.disaster.Disaster_Management.disaster.alert.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    
    List<Alert> findByRegion(String region);
    
    List<Alert> findByStatus(String status);
    
    @Query("SELECT a FROM Alert a WHERE a.region = :region AND a.status = 'ACTIVE'")
    List<Alert> findActiveAlertsByRegion(@Param("region") String region);
    
    List<Alert> findByCreatedBy(String createdBy);
    
    @Query("SELECT COUNT(a) FROM Alert a WHERE a.status = 'ACTIVE'")
    long countActiveAlerts();  
}