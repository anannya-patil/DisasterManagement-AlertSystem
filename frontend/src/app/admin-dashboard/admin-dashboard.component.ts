import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DisasterService } from '../services/disaster.service';
import { AlertService } from '../services/alert.service';   // NEW
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  pendingDisasters: any[] = [];
  userEmail = '';

  // NEW — Alert form fields
  alertTitle = '';
  alertMessage = '';
  alertRegion = '';
  alertDisasterId: number | null = null;
  alertResponse = '';

  constructor(
    private disasterService: DisasterService,
    private alertService: AlertService,   // NEW
    private authService: AuthService,
    private router: Router
  ) {
    this.userEmail = this.authService.getUserEmail() || '';
  }

  ngOnInit(): void {
    this.loadPending();
  }

  loadPending(): void {
    this.disasterService.getPendingDisasters().subscribe({
      next: (data: any) => {
        this.pendingDisasters = data.content || data;
      },
      error: (err) => console.error(err)
    });
  }

  approve(id: number): void {
    this.disasterService.approveDisaster(id).subscribe(() => {
      this.loadPending();
    });
  }

  reject(id: number): void {
    this.disasterService.rejectDisaster(id).subscribe(() => {
      this.loadPending();
    });
  }

  resolve(id: number): void {
    this.disasterService.resolveDisaster(id).subscribe(() => {
      this.loadPending();
    });
  }

  // NEW — Broadcast Alert
  broadcastAlert(): void {

    const payload = {
      title: this.alertTitle,
      message: this.alertMessage,
      region: this.alertRegion,
      disasterId: this.alertDisasterId
    };

    this.alertService.broadcastAlert(payload).subscribe({
      next: () => {
        this.alertResponse = "Alert broadcasted successfully";
        this.alertTitle = '';
        this.alertMessage = '';
        this.alertRegion = '';
        this.alertDisasterId = null;

        setTimeout(() => this.alertResponse = '', 4000);
      },
      error: (err) => {
        console.error(err);
        this.alertResponse = "Failed to broadcast alert";
      }
    });

  }

  goToDisasters(): void {
    this.router.navigate(['/disasters']);
  }

  logout(): void {
    this.authService.logout();
  }
}