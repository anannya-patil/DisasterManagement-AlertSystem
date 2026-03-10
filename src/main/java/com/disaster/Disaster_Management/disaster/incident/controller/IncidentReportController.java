package com.disaster.Disaster_Management.disaster.incident.controller;
import com.disaster.Disaster_Management.disaster.incident.entity.IncidentReport;
import com.disaster.Disaster_Management.disaster.incident.service.IncidentReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentReportController
{

    @Autowired
    private IncidentReportService incidentReportService;

    @PostMapping
    public IncidentReport submitReport(@RequestBody IncidentReport report)
    {
        return incidentReportService.submitReport(report);
    }

    @GetMapping("/task/{rescueTaskId}")
    public List<IncidentReport> getReportsByTask(@PathVariable Long rescueTaskId)
    {
        return incidentReportService.getReportsByTask(rescueTaskId);
    }

    @GetMapping("/responder/{responderId}")
    public List<IncidentReport> getReportsByResponder(@PathVariable Long responderId)
    {
        return incidentReportService.getReportsByResponder(responderId);
    }

    @GetMapping("/recent")
    public List<IncidentReport> getRecentReports()
    {
        return incidentReportService.getRecentReports();
    }
}