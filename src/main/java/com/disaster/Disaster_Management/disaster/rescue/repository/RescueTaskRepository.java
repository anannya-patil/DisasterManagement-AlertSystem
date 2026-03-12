package com.disaster.Disaster_Management.disaster.rescue.repository;

import com.disaster.Disaster_Management.disaster.rescue.entity.RescueTask;
import com.disaster.Disaster_Management.disaster.common.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RescueTaskRepository extends JpaRepository<RescueTask, Long> {
    
    List<RescueTask> findByResponderId(Long responderId);
    List<RescueTask> findByDisasterId(Long disasterId);
    List<RescueTask> findByTaskStatus(TaskStatus status);
    List<RescueTask> findByZone(String zone);
    
    @Query("SELECT r FROM RescueTask r WHERE r.responderId = :responderId AND r.taskStatus IN ('ASSIGNED', 'IN_PROGRESS')")
    List<RescueTask> findActiveTasksByResponder(@Param("responderId") Long responderId);
    
    @Query("SELECT r.taskStatus, COUNT(r) FROM RescueTask r GROUP BY r.taskStatus")
    List<Object[]> countTasksByStatus();
    
    List<RescueTask> findByAssignedByAdminId(Long adminId);
}