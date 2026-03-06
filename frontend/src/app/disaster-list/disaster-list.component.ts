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
import { AlertService } from '../services/alert.service';

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
  DisasterStatus = DisasterStatus;

  // ========== DATA PROPERTIES ==========
  disasters: DisasterEvent[] = [];
  
  // ========== LOCATION PROPERTIES (DYNAMIC) ==========
  uniqueLocations: string[] = [];        // Unique locations from database
  filteredLocations: string[] = [];      // Filtered locations for search
  
  // ========== FILTER PROPERTIES ==========
  currentFilter: DisasterFilter = {
    page: 0,
    size: 10,
    liveOnly: false
  };
  
  // Filter options for dropdowns
  disasterTypes = ['FLOOD', 'CYCLONE', 'EARTHQUAKE', 'FIRE', 'STORM'];
  severityLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  
  // ========== PAGINATION PROPERTIES ==========
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50];
  
  // ========== UI STATE PROPERTIES ==========
  loading = false;
  errorMessage = '';
  userRole: string | null = null;
  
  // ========== WEBSOCKET PROPERTIES ==========
  private wsSubscription: Subscription | null = null;

  constructor(
    private disasterService: DisasterService,
    private webSocketService: WebSocketService,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.userRole = this.authService.getUserRole();
  }

  // ========== LIFECYCLE METHODS ==========
  ngOnInit() {
    this.loadDisasters();
   // this.setupWebSocket();
  }

  ngOnDestroy() {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
    // this.webSocketService.disconnect();
  }

  // ========== WEBSOCKET METHODS ==========
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

  // ========== DATA LOADING METHODS ==========
  loadDisasters() {
    this.loading = true;
    this.errorMessage = '';
    
    console.log('Fetching disasters with filter:', this.currentFilter);
    
    this.disasterService.getDisasters(this.currentFilter).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        this.disasters = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.pageSize = response.size;
        this.loading = false;
        
        // Get unique locations from actual data
        this.getUniqueLocations();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to load disasters. Please try again.';
        console.error('Error loading disasters:', error);
      }
    });
  }

  // ========== LOCATION METHODS ==========
  getUniqueLocations() {
    // Extract unique locations from disasters data
    const locations = this.disasters.map(d => d.locationName);
    // Remove duplicates using Set
    this.uniqueLocations = [...new Set(locations)];
    // Initialize filtered list with all unique locations
    this.filteredLocations = [...this.uniqueLocations];
    
    console.log('Unique locations found:', this.uniqueLocations); // For debugging
  }

  getDisasterCountForLocation(location: string): number {
    return this.disasters.filter(d => d.locationName === location).length;
  }

  // ========== FILTER METHODS ==========
  onFilterChange(filter: DisasterFilter) {
    this.currentFilter = { ...filter, page: 0, size: this.pageSize };
    this.loadDisasters();
  }

  // Location search in sidebar
  onSearch(event: any) {
  const searchTerm = event.target.value.toLowerCase();
  this.filteredLocations = this.uniqueLocations.filter(loc =>  // ✅ Using new 'uniqueLocations'
    loc.toLowerCase().includes(searchTerm)
  );
}

  // Filter by type from dropdown
  onTypeChange(event: any) {
    const type = event.target.value;
    this.currentFilter.type = type || undefined;
    this.currentFilter.page = 0; // Reset to first page
    this.loadDisasters();
  }

  // Filter by severity from dropdown
  onSeverityChange(event: any) {
    const severity = event.target.value;
    this.currentFilter.severity = severity || undefined;
    this.currentFilter.page = 0; // Reset to first page
    this.loadDisasters();
  }

  // Filter by location from dropdown
  onLocationChange(event: any) {
    const location = event.target.value;
    this.currentFilter.location = location || undefined;
    this.currentFilter.page = 0; // Reset to first page
    this.loadDisasters();
  }

  // Select location from sidebar list
  selectLocation(location: string) {
    this.currentFilter.location = location;
    this.currentFilter.page = 0; // Reset to first page
    this.loadDisasters();
  }

  // ========== PAGINATION METHODS ==========
  onPageChange(page: number) {
    this.currentFilter.page = page;
    this.loadDisasters();
  }

  onPageSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.currentFilter.size = this.pageSize;
    this.currentFilter.page = 0; // Reset to first page
    this.loadDisasters();
  }

  // Helper for pagination display
  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // ========== ADMIN ACTION METHODS ==========
  approveDisaster(id: number) {
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

  rejectDisaster(id: number) {
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

  editDisaster(disaster: DisasterEvent) {
  if (this.userRole === 'ADMIN') {
    // Navigate to edit page with disaster ID
    this.router.navigate(['/edit-disaster', disaster.id]);
  }
}

  // ========== RESPONDER ACTION METHODS ==========
  assignTask(id: number) {
    if (this.userRole === 'RESPONDER') {
      console.log('Assigning task for disaster:', id);
      alert(`Task assignment for disaster ID: ${id} - To be implemented`);
    }
  }

  // ========== HELPER METHODS ==========
  getSeverityClass(severity: string): string {
    const classes: { [key: string]: string } = {
      'LOW': 'low',
      'MEDIUM': 'medium',
      'HIGH': 'high',
      'CRITICAL': 'critical'
    };
    return classes[severity] || '';
  }

  prepareAlert(disaster: any): void {

    const payload = {
      title: `${disaster.disasterType} Alert`,
      message: `Emergency alert for ${disaster.locationName}. Please follow safety instructions.`,
      region: disaster.locationName,
      // severity: disaster.severity,
      disasterId: disaster.id
    };

    this.alertService.broadcastAlert(payload).subscribe({
      next: () => {
        disaster.alertSent = true;
        alert("Alert broadcasted successfully");
      },
      error: (err) => {
        console.error(err);
        alert("Failed to broadcast alert");
      }
    });

  }
}