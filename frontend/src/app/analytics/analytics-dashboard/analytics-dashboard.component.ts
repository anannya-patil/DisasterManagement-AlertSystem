import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent {

  constructor(private analyticsService: AnalyticsService) {}
  
  ngOnInit(){
    this.loadData();
  }
  
  data:any={};
    
  loadData(){

    this.analyticsService.getDisasterAnalytics()
      .subscribe(res=>{
        console.log("DISASTER:",res);
        this.data.disasters=res;
      });

    this.analyticsService.getResponderAnalytics()
      .subscribe(res=>{
        console.log("RESPONDER:",res);
        this.data.responders=res;
      });

    this.analyticsService.getResponseTimeAnalytics()
      .subscribe(res=>{
        console.log("TIMES:",res);
        this.data.times=res;
      });

    this.analyticsService.getAlertAnalytics()
      .subscribe(res=>{
        console.log("ALERTS:",res);
        this.data.alerts=res;
      });
  }
}
