package com.disaster.Disaster_Management.disaster.incident.service;

import com.disaster.Disaster_Management.disaster.incident.entity.IncidentReport;
import com.disaster.Disaster_Management.disaster.incident.repository.IncidentReportRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncidentReportService
{

    @Autowired
    private IncidentReportRepository incidentReportRepository;

    public IncidentReport submitReport(IncidentReport report)
    {
        if(report==null)
        {
            throw new IllegalArgumentException("Report cannot be null");
        }
        return incidentReportRepository.save(report);
    }

    public List<IncidentReport> getReportsByTask(Long rescueTaskId)
    {
        return incidentReportRepository.findByRescueTaskId(rescueTaskId);
    }

    public List<IncidentReport> getReportsByResponder(Long responderId)
    {
        return incidentReportRepository.findByResponderId(responderId);
    }

    public List<IncidentReport> getRecentReports()
    {
        return incidentReportRepository.findTop10ByOrderBySubmittedAtDesc();
    }

}