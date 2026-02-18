import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DisasterService } from '../services/disaster.service';
import { WebSocketService } from '../services/websocket.service';
import { DisasterEvent, DisasterFilter, DisasterStatus } from '../models/disaster.model';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { DisasterFiltersComponent } from '../disaster-filters/disaster-filters.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-disaster-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    DisasterFiltersComponent
  ],
  templateUrl: './disaster-list.component.html',
  styleUrls: ['./disaster-list.component.css']
})
export class DisasterListComponent implements OnInit, OnDestroy {
  disasters: DisasterEvent[] = [];
  currentFilter: DisasterFilter = {
    page: 0,
    size: 10,
    liveOnly: false
  };
  
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50];
  
  loading = false;
  errorMessage = '';
  
  userRole: string | null = null;
  private wsSubscription: Subscription | null = null;

  constructor(
    private disasterService: DisasterService,
    private webSocketService: WebSocketService,
    private authService: AuthService,
    private router: Router
  ) {
    this.userRole = this.authService.getUserRole();
  }

  ngOnInit() {
    this.loadDisasters();
    this.setupWebSocket();
  }

  ngOnDestroy() {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
    this.webSocketService.disconnect();
  }

  setupWebSocket() {
    this.webSocketService.connect().then(() => {
      this.wsSubscription = this.webSocketService.onDisasterUpdate().subscribe(
        (updatedDisaster) => {
          this.handleRealTimeUpdate(updatedDisaster);
        }
      );
    }).catch(error => {
      console.error('WebSocket connection failed', error);
    });
  }

  handleRealTimeUpdate(updatedDisaster: DisasterEvent) {
    const index = this.disasters.findIndex(d => d.id === updatedDisaster.id);
    if (index !== -1) {
      this.disasters[index] = updatedDisaster;
    } else {
      this.disasters.unshift(updatedDisaster);
    }
    
    if (updatedDisaster.status === DisasterStatus.REJECTED || 
        updatedDisaster.status === DisasterStatus.RESOLVED) {
      this.disasters = this.disasters.filter(d => d.id !== updatedDisaster.id);
    }
  }

  loadDisasters() {
    this.loading = true;
    this.errorMessage = '';
    
    this.disasterService.getDisasters(this.currentFilter).subscribe({
      next: (response) => {
        this.disasters = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.pageSize = response.size;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to load disasters. Please try again.';
        console.error('Error loading disasters:', error);
      }
    });
  }

  onFilterChange(filter: DisasterFilter) {
    this.currentFilter = { ...filter, page: 0, size: this.pageSize };
    this.loadDisasters();
  }

  onPageChange(page: number) {
    this.currentFilter.page = page;
    this.loadDisasters();
  }

  onPageSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.currentFilter.size = this.pageSize;
    this.currentFilter.page = 0;
    this.loadDisasters();
  }

  // ✅ NEW METHOD: Approve disaster (Admin only)
  onApprove(id: number) {
    if (this.userRole === 'ADMIN') {
      this.disasterService.approveDisaster(id).subscribe({
        next: () => {
          this.loadDisasters(); // Reload the list
        },
        error: (error) => {
          console.error('Error approving disaster:', error);
        }
      });
    }
  }

  // ✅ NEW METHOD: Reject disaster (Admin only)
  onReject(id: number) {
    if (this.userRole === 'ADMIN') {
      if (confirm('Are you sure you want to reject this disaster?')) {
        this.disasterService.rejectDisaster(id).subscribe({
          next: () => {
            this.loadDisasters(); // Reload the list
          },
          error: (error) => {
            console.error('Error rejecting disaster:', error);
          }
        });
      }
    }
  }

  // ✅ NEW METHOD: Edit disaster (Admin only)
  onEdit(disaster: DisasterEvent) {
    // Navigate to edit page or open modal
    console.log('Edit disaster:', disaster);
    // You can implement edit functionality here
  }

  // ✅ NEW METHOD: Assign task (Responder only)
  onAssign(id: number) {
    if (this.userRole === 'RESPONDER') {
      console.log('Assigning task for disaster:', id);
      // Implement assign functionality here
    }
  }

  // ✅ NEW METHOD: Math.min for pagination
  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  getSeverityClass(severity: string): string {
    const classes: { [key: string]: string } = {
      'LOW': 'severity-low',
      'MEDIUM': 'severity-medium',
      'HIGH': 'severity-high',
      'CRITICAL': 'severity-critical'
    };
    return classes[severity] || '';
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}