package com.disaster.Disaster_Management.disaster.rescue.controller;

import com.disaster.Disaster_Management.disaster.rescue.entity.RescueTask;
import com.disaster.Disaster_Management.disaster.rescue.service.RescueTaskService;
import com.disaster.Disaster_Management.disaster.common.TaskStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/responder/rescue-tasks")
public class ResponderRescueController
{
    @Autowired
    private RescueTaskService rescueTaskService;

    @GetMapping("/{responderId}")
    public List<RescueTask> getResponderTasks(@PathVariable Long responderId)
    {
        return rescueTaskService.getTasksForResponder(responderId);
    }

    @GetMapping("/active/{responderId}")
    public List<RescueTask> getActiveTasks(@PathVariable Long responderId)
    {
        return rescueTaskService.getActiveTasksForResponder(responderId);
    }

    @PutMapping("/{taskId}/status")
    public RescueTask updateTaskStatus(@PathVariable Long taskId, @RequestParam TaskStatus status)
    {
        return rescueTaskService.updateTaskStatus(taskId,status);
    }
}