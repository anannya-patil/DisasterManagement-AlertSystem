import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { EmergencyService } from '../services/emergency.service';
import { RescueService } from '../services/rescue.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-responder-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './responder-dashboard.component.html',
  styleUrl: './responder-dashboard.component.css'
})

export class ResponderDashboardComponent implements OnInit {
  alerts:any[]=[];
  emergencyRequests:any[]=[];
  rescueTasks:any[]=[];
  userEmail='';
  selectedTaskId:number|null=null;
  reportDetails='';
  completedTasks:any[]=[];

  constructor(
    private alertService:AlertService,
    private emergencyService:EmergencyService,
    private rescueService:RescueService,
    private authService:AuthService,
    private router:Router
  ){
    this.userEmail=this.authService.getUserEmail()||'';
  }

  ngOnInit():void{
    this.loadAlerts();
    this.loadRequests();
    this.loadRescueTasks();
  }

  loadAlerts():void{
    this.alertService.getResponderAlerts().subscribe({
      next:(data)=>{
        this.alerts=data;
      },
      error:(err)=>console.error(err)
    });
  }

  loadRequests():void{
    this.emergencyService.getAssignedRequests().subscribe({
      next:(data)=>{
        this.emergencyRequests = data.filter((r:any) => r.status !== 'COMPLETED')
      },
      error:(err)=>console.error(err)
    });
  }

  completeRequest(id:number)
  {
    this.emergencyService.updateRequestStatus(id,'COMPLETED')
      .subscribe({
        next:()=>{
          this.loadRequests();
        },
        error:(err)=>console.error(err)
      });
  }

  loadRescueTasks():void{
    const responderId=this.authService.getUserId();

    if(!responderId){
      console.error("Responder ID not found");
      return;
    }

    this.rescueService.getResponderTasks(responderId).subscribe({
      next:(data)=>{
        this.rescueTasks = data.filter((t:any)=>t.taskStatus!=='COMPLETED');
        this.completedTasks = data.filter((t:any)=>t.taskStatus==='COMPLETED');
      },
      error:(err)=>console.error(err)
    });
  }

  startTask(taskId:number):void{
    this.rescueService.updateTaskStatus(taskId,'IN_PROGRESS')
      .subscribe({
        next:()=>{
          this.loadRescueTasks();
        },
        error:(err)=>console.error(err)
      });
  }

  completeTask(taskId:number):void{
    this.rescueService.updateTaskStatus(taskId,'COMPLETED')
      .subscribe({
        next:()=>{
          this.loadRescueTasks();
        },
        error:(err)=>console.error(err)
      });
  }

  acknowledge(id:number):void{
    this.alertService.acknowledgeAlert(id).subscribe({
      next:()=>{
        const alert=this.alerts.find(a=>a.id===id);
        if(alert){
          alert.acknowledged=true;
        }
      },
      error:(err)=>{
        console.error(err);
        alert("Already acknowledged");
      }
    });
  }

  openReportForm(taskId:number):void{
    this.selectedTaskId=taskId;
  }

  submitReport():void{
    const responderId=this.authService.getUserId();

    if(!this.selectedTaskId || !responderId){
      return;
    }

    const payload={
      rescueTaskId:this.selectedTaskId,
      responderId:responderId,
      reportDetails:this.reportDetails,
      latitude:18.5204,
      longitude:73.8567
    };

    this.rescueService.submitIncidentReport(payload)
      .subscribe({
        next:()=>{
          this.rescueService.updateTaskStatus(this.selectedTaskId!,'COMPLETED')
            .subscribe(()=>this.loadRescueTasks());

          alert("Report submitted successfully");
          this.reportDetails='';
          this.selectedTaskId=null;
        },
        error:(err)=>console.error(err)
      });
  }

  logout():void{
    this.authService.logout();
  }
}