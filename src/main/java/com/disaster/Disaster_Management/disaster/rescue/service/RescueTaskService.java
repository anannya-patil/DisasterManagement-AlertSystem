package com.disaster.Disaster_Management.disaster.rescue.service;

import com.disaster.Disaster_Management.disaster.rescue.entity.RescueTask;
import com.disaster.Disaster_Management.disaster.rescue.repository.RescueTaskRepository;
import com.disaster.Disaster_Management.entity.DisasterEvent;
import com.disaster.Disaster_Management.repository.DisasterEventRepository;
import com.disaster.Disaster_Management.disaster.common.TaskStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.disaster.Disaster_Management.entity.User;

@Service
public class RescueTaskService
{

    @Autowired
    private RescueTaskRepository rescueTaskRepository;
    @Autowired
    private DisasterEventRepository disasterRepository;

    public RescueTask assignTask(RescueTask task)
    {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User admin = (User) auth.getPrincipal();

        task.setAssignedByAdminId(admin.getId());

        task.setTaskStatus(TaskStatus.ASSIGNED);

        return rescueTaskRepository.save(task);
    }

    public List<RescueTask> getAllTasks()
    {
        return rescueTaskRepository.findAll();
    }

    public List<RescueTask> getTasksForResponder(Long responderId)
    {
        return rescueTaskRepository.findByResponderId(responderId);
    }

    public List<RescueTask> getActiveTasksForResponder(Long responderId)
    {
        return rescueTaskRepository.findActiveTasksByResponder(responderId);
    }

    public RescueTask updateTaskStatus(Long taskId, TaskStatus status)
    {
        RescueTask task = rescueTaskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTaskStatus(status);
        return rescueTaskRepository.save(task);
    }

    public List<RescueTask> getTasksByDisaster(Long disasterId)
    {
        return rescueTaskRepository.findByDisasterId(disasterId);
    }

}