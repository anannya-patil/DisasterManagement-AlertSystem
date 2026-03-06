import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { EmergencyService } from '../services/emergency.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-responder-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './responder-dashboard.component.html',
  styleUrl: './responder-dashboard.component.css'
})
export class ResponderDashboardComponent implements OnInit {

  alerts: any[] = [];
  emergencyRequests: any[] = [];
  userEmail = '';

  constructor(
    private alertService: AlertService,
    private emergencyService: EmergencyService,
    private authService: AuthService,
    private router: Router
  ) {
    this.userEmail = this.authService.getUserEmail() || '';
  }

  ngOnInit(): void {
    this.loadAlerts();
    this.loadRequests();
  }

  loadAlerts(): void {
    this.alertService.getResponderAlerts().subscribe({
      next: (data) => {
        this.alerts = data;
      },
      error: (err) => console.error(err)
    });
  }

  loadRequests(): void {
    this.emergencyService.getAssignedRequests().subscribe({
      next: (data) => {
        this.emergencyRequests = data;
      },
      error: (err) => console.error(err)
    });
  }

  acknowledge(id: number): void {
    this.alertService.acknowledgeAlert(id).subscribe({
      next: () => {
        const alert = this.alerts.find(a => a.id === id);
        if (alert) {
          alert.acknowledged = true;
        }
      },
      error: (err) => {
        console.error(err);
        alert("Already acknowledged");
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

}