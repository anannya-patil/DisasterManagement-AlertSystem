import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { DisasterEvent } from '../models/disaster.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client;
  private disasterSubject = new Subject<DisasterEvent>();
  private connectionPromise: Promise<void> | null = null;

  constructor() {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      debug: (str) => console.log('WebSocket:', str),
      // ✅ ADD TOKEN TO CONNECTION HEADERS
      connectHeaders: token ? {
        'Authorization': `Bearer ${token}`
      } : {}
    });
  }

  connect(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      this.client.onConnect = () => {
        console.log('✅ Connected to WebSocket');
        
        this.client.subscribe('/topic/disaster-updates', (message: IMessage) => {
          try {
            const disaster: DisasterEvent = JSON.parse(message.body);
            console.log('📡 Real-time update received:', disaster);
            this.disasterSubject.next(disaster);
          } catch (error) {
            console.error('❌ Error parsing message:', error);
          }
        });

        resolve();
      };

      this.client.onStompError = (frame) => {
        console.error('❌ STOMP error:', frame);
        reject(frame);
      };

      this.client.onWebSocketError = (event) => {
        console.error('❌ WebSocket error:', event);
      };

      this.client.onDisconnect = () => {
        console.log('🔌 WebSocket disconnected');
      };

      this.client.activate();
    });

    return this.connectionPromise;
  }

  onDisasterUpdate(): Observable<DisasterEvent> {
    return this.disasterSubject.asObservable();
  }

  disconnect() {
    if (this.client && this.client.connected) {
      this.client.deactivate();
      console.log('🔌 WebSocket deactivated');
    }
  }
}