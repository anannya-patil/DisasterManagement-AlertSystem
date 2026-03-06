import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AcknowledgmentService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  acknowledgeAlert(alertId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/responder/alerts/${alertId}/acknowledge`,
      {},
      { headers: this.getHeaders() }
    );
  }

}