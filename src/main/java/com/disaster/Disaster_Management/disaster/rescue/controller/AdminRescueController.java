package com.disaster.Disaster_Management.disaster.rescue.controller;

import com.disaster.Disaster_Management.disaster.rescue.entity.RescueTask;
import com.disaster.Disaster_Management.disaster.rescue.service.RescueTaskService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/rescue-tasks")
public class AdminRescueController
{
    @Autowired
    private RescueTaskService rescueTaskService;

    @PostMapping
    public RescueTask assignTask(@RequestBody RescueTask task)
    {
        return rescueTaskService.assignTask(task);
    }

    @GetMapping
    public List<RescueTask> getAllTasks()
    {
        return rescueTaskService.getAllTasks();
    }
}