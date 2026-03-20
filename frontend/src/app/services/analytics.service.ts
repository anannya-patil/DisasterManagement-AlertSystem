import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private apiUrl = 'http://localhost:8080/api/analytics';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getDisasterAnalytics(){
    return this.http.get(`${this.apiUrl}/disasters`, {
      headers: this.getHeaders()
    });
  }

  getResponderAnalytics(){
    return this.http.get(`${this.apiUrl}/responders`, {
      headers: this.getHeaders()
    });
  }

  getResponseTimeAnalytics(){
    return this.http.get(`${this.apiUrl}/response-times`, {
      headers: this.getHeaders()
    });
  }

  getAlertAnalytics(){
    return this.http.get(`${this.apiUrl}/alerts`, {
      headers: this.getHeaders()
    });
  }
}