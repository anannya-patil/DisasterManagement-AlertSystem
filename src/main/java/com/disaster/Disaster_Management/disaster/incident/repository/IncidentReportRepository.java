package com.disaster.Disaster_Management.disaster.incident.repository;

import com.disaster.Disaster_Management.disaster.incident.entity.IncidentReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IncidentReportRepository extends JpaRepository<IncidentReport, Long> {
    
    List<IncidentReport> findByRescueTaskId(Long rescueTaskId);
    List<IncidentReport> findByResponderId(Long responderId);
    
    List<IncidentReport> findTop10ByOrderBySubmittedAtDesc();
    
    @Query("SELECT i.responderId, COUNT(i) FROM IncidentReport i GROUP BY i.responderId")
    List<Object[]> countReportsByResponder();
    
    @Query("SELECT i FROM IncidentReport i WHERE i.submittedAt BETWEEN :startDate AND :endDate")
    List<IncidentReport> findByDateRange(@Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate);
}