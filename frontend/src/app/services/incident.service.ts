import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class IncidentService {
  private apiUrl='http://localhost:8080/api/incidents';

  constructor(private http:HttpClient){}

  submitReport(payload:any):Observable<any>{
    return this.http.post(this.apiUrl,payload);
  }

  getReportsByTask(taskId:number):Observable<any>{
    return this.http.get(`${this.apiUrl}/task/${taskId}`);
  }
}