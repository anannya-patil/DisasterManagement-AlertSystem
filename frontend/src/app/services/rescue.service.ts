import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class RescueService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  assignTask(payload:any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/admin/rescue-tasks`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  getResponderTasks(responderId:number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/responder/rescue-tasks/${responderId}`,
      { headers: this.getHeaders() }
    );
  }

  updateTaskStatus(taskId:number,status:string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/responder/rescue-tasks/${taskId}/status?status=${status}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  submitIncidentReport(payload:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/incidents`, payload);
  }
}