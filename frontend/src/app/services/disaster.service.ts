import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DisasterEvent, DisasterFilter, PageResponse } from '../models/disaster.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DisasterService {
  private apiUrl = 'http://localhost:8080/disasters';
  private adminUrl = 'http://localhost:8080/admin/disasters';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Helper method to add auth header
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllUsers(){
    return this.http.get<any[]>(
      `http://localhost:8080/admin/users`,
      {headers:this.getHeaders()}
    );
  }

  // PUBLIC API - Get filtered disasters (WITH AUTH HEADER)
  getDisasters(filter: DisasterFilter): Observable<PageResponse<DisasterEvent>> {
    let params = new HttpParams()
      .set('page', filter.page.toString())
      .set('size', filter.size.toString());

    if (filter.type) params = params.set('type', filter.type);
    if (filter.severity) params = params.set('severity', filter.severity);
    if (filter.location) params = params.set('location', filter.location);
    if (filter.startDate) params = params.set('startDate', filter.startDate.toISOString());
    if (filter.endDate) params = params.set('endDate', filter.endDate.toISOString());
    if (filter.liveOnly) params = params.set('liveOnly', 'true');

    return this.http.get<PageResponse<DisasterEvent>>(`${this.apiUrl}`, { 
      params,
      headers: this.getHeaders() 
    });
  }

  // Get single disaster by ID
  getDisasterById(id: number): Observable<DisasterEvent> {
    return this.http.get<DisasterEvent>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // ADMIN API - Get pending disasters
  getPendingDisasters(): Observable<DisasterEvent[]> {
    return this.http.get<DisasterEvent[]>(`${this.adminUrl}/pending`, {
      headers: this.getHeaders()
    });
  }

  // ADMIN API - Approve disaster
  approveDisaster(id: number): Observable<DisasterEvent> {
    return this.http.put<DisasterEvent>(`${this.adminUrl}/${id}/approve`, {}, {
      headers: this.getHeaders()
    });
  }

  // ADMIN API - Reject disaster
  rejectDisaster(id: number): Observable<void> {
    return this.http.put<void>(`${this.adminUrl}/${id}/reject`, {}, {
      headers: this.getHeaders()
    });
  }

  // ADMIN API - Mark as resolved
  resolveDisaster(id: number): Observable<DisasterEvent> {
    return this.http.put<DisasterEvent>(`${this.adminUrl}/${id}/resolve`, {}, {
      headers: this.getHeaders()
    });
  }

  // ADMIN API - Edit disaster
  updateDisaster(id: number, disaster: Partial<DisasterEvent>): Observable<DisasterEvent> {
    return this.http.put<DisasterEvent>(`${this.adminUrl}/${id}`, disaster, {
      headers: this.getHeaders()
    });
  }
}