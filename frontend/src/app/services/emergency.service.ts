import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmergencyService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // CITIZEN: submit emergency request
  submitEmergencyRequest(
    description: string,
    latitude: number,
    longitude: number,
    region: string
  ): Observable<any> {

    const url = `${this.baseUrl}/citizen/emergency-request?description=${description}&latitude=${latitude}&longitude=${longitude}&region=${region}`;

    return this.http.post(url, {}, {
      headers: this.getHeaders()
    });
  }

  // RESPONDER: view assigned requests
  getAssignedRequests(): Observable<any> {
    return this.http.get(`${this.baseUrl}/responder/emergency-requests`, {
      headers: this.getHeaders()
    });
  }

}