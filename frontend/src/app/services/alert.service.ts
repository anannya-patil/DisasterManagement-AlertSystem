import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ========================
  // CITIZEN APIs
  // ========================

  getAlerts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/alerts`, {
      headers: this.getHeaders()
    });
  }

  requestRescue(region: string, description: string): Observable<any> {
    const latitude = 0;
    const longitude = 0;

    const url =
      `${this.baseUrl}/citizen/emergency-request` +
      `?description=${description}` +
      `&latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&region=${region}`;

    return this.http.post(url, {}, {
      headers: this.getHeaders()
    });
  }

  reportIncident(type: string, location: string, description: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/citizen/report-incident`,
      { type, location, description },
      { headers: this.getHeaders(), responseType: 'text' }
    );
  }

  // ========================
  // ADMIN APIs
  // ========================

  broadcastAlert(data: any): Observable<any> {

    const url =
      `${this.baseUrl}/admin/alerts` +
      `?disasterId=${data.disasterId}` +
      `&title=${encodeURIComponent(data.title)}` +
      `&message=${encodeURIComponent(data.message)}` +
      `&region=${encodeURIComponent(data.region)}`;

    return this.http.post(url, {}, {
      headers: this.getHeaders()
    });
  }

  resolveAlert(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/alerts/${id}/resolve`,
      {},
      { headers: this.getHeaders() }
    );
  }

  // ========================
  // RESPONDER APIs
  // ========================

  getResponderAlerts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/responder/alerts`,
      { headers: this.getHeaders() }
    );
  }

  acknowledgeAlert(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/responder/alerts/${id}/acknowledge`,
      {},
      { headers: this.getHeaders() }
    );
  }
}
