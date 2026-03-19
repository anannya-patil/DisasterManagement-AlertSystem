import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DisasterService } from '../services/disaster.service';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { RescueService } from '../services/rescue.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  pendingDisasters: any[] = [];
  userEmail = '';

  alertTitle = '';
  alertMessage = '';
  alertRegion = '';
  alertDisasterId: number | null = null;
  alertResponse = '';

  taskDisasterId:number|null=null;
  taskResponderId:number|null=null;
  taskZone='';
  taskDescription='';
  taskLatitude:number|null=null;
  taskLongitude:number|null=null;
  taskResponse='';

  constructor(
    private disasterService: DisasterService,
    private alertService: AlertService,
    private rescueService: RescueService,
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

  assignTask():void{

  const payload={
    disasterId:this.taskDisasterId,
    responderId:this.taskResponderId,
    zone:this.taskZone,
    taskDescription:this.taskDescription,
    latitude:this.taskLatitude,
    longitude:this.taskLongitude
  };

    this.rescueService.assignTask(payload).subscribe({
      next:()=>{
        this.taskResponse="Task assigned successfully";

        this.taskDisasterId=null;
        this.taskResponderId=null;
        this.taskZone='';
        this.taskDescription='';
        this.taskLatitude=null;
        this.taskLongitude=null;

        setTimeout(()=>this.taskResponse='',4000);
      },
      error:(err)=>{
        console.error(err);
        this.taskResponse="Failed to assign task";
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