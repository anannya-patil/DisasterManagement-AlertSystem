package com.disaster.Disaster_Management.repository;

import com.disaster.Disaster_Management.entity.DisasterEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DisasterEventRepository 
        extends JpaRepository<DisasterEvent, Long>,
                JpaSpecificationExecutor<DisasterEvent> {

    @Query(value = """
        SELECT * FROM disaster_events
        WHERE status = 'PENDING'
          AND disaster_type = 'EARTHQUAKE'
          AND magnitude > 6.0
          AND created_at <= NOW() - INTERVAL 5 MINUTE
        """, nativeQuery = true)
    List<DisasterEvent> findAutoVerifiableEarthquakes();

    @Query("SELECT d.disasterType, COUNT(d) FROM DisasterEvent d GROUP BY d.disasterType")
    List<Object[]> countByType();

    @Query("SELECT d.locationName, COUNT(d) FROM DisasterEvent d GROUP BY d.locationName")
    List<Object[]> countByRegion();

    @Query("SELECT FUNCTION('MONTH', d.eventTime), COUNT(d) FROM DisasterEvent d GROUP BY FUNCTION('MONTH', d.eventTime)")
    List<Object[]> countByMonth();
}