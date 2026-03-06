import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DisasterService } from '../services/disaster.service';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-citizen-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citizen-dashboard.component.html',
  styleUrls: ['./citizen-dashboard.component.css']
})
export class CitizenDashboardComponent implements OnInit {
  alerts: any[] = [];
  userEmail = '';
  
  // Rescue request
  location = '';
  message = '';
  rescueResponse = '';
  
  // Incident report
  incidentType = '';
  incidentLocation = '';
  incidentDescription = '';
  incidentResponse = '';

  constructor(
    private disasterService: DisasterService,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router
  ) {
    this.userEmail = this.authService.getUserEmail() || '';
  }

  ngOnInit(): void {
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.disasterService.getDisasters({
      page: 0,
      size: 10,
      liveOnly: true
    }).subscribe({
      next: (data) => {
        this.alerts = data.content;
      },
      error: (error) => {
        console.error('Error loading disasters', error);
      }
    });
  }

  // requestRescue(): void {
  //   this.alertService.requestRescue(this.location, this.message).subscribe({
  //     next: (response) => {
  //       this.rescueResponse = response;
  //       setTimeout(() => this.rescueResponse = '', 5000);
  //       this.location = '';
  //       this.message = '';
  //     },
  //     error: (error) => {
  //       console.error('Error requesting rescue', error);
  //       this.rescueResponse = 'Failed to send request';
  //     }
  //   });
  // }

  // reportIncident(): void {
  //   this.alertService.reportIncident(
  //     this.incidentType, 
  //     this.incidentLocation, 
  //     this.incidentDescription
  //   ).subscribe({
  //     next: (response) => {
  //       this.incidentResponse = response;
  //       setTimeout(() => this.incidentResponse = '', 5000);
  //       this.incidentType = '';
  //       this.incidentLocation = '';
  //       this.incidentDescription = '';
  //     },
  //     error: (error) => {
  //       console.error('Error reporting incident', error);
  //       this.incidentResponse = 'Failed to report incident';
  //     }
  //   });
  // }

requestRescue(): void {

  const region = this.location;
  const description = this.message;

  const latitude = 0;
  const longitude = 0;

  this.alertService.requestRescue(region, description).subscribe({
    next: (response) => {
      this.rescueResponse = "Emergency request sent successfully";
      this.location = '';
      this.message = '';
    },
    error: (error) => {
      console.error("Error sending rescue request", error);
      this.rescueResponse = "Failed to send emergency request";
    }
  });

}

  reportIncident(): void {
    console.log("Incident feature not connected yet.");
  }

  logout(): void {
    this.authService.logout();
  }
}