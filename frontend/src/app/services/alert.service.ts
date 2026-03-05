import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private baseUrl = 'http://localhost:8080/api';

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

  requestRescue(location: string, message: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/citizen/request-rescue`,
      { location, message },
      { headers: this.getHeaders(), responseType: 'text' as 'json' }
    );
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
    return this.http.post(`${this.baseUrl}/admin/alerts`,
      data,
      { headers: this.getHeaders() }
    );
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
requestRescue(location: string, message: string): Observable<any> {
  return this.http.post(
    `${this.baseUrl}/citizen/request-rescue`,
    { location, message },
    { headers: this.getHeaders(), responseType: 'text' as 'json' }
  );
}

reportIncident(type: string, location: string, description: string): Observable<any> {
  return this.http.post(
    `${this.baseUrl}/citizen/report-incident`,
    { type, location, description },
    { headers: this.getHeaders(), responseType: 'text' as 'json' }
  );
}