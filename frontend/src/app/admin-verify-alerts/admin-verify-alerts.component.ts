import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DisasterService } from '../services/disaster.service';
import { DisasterEvent, DisasterType, SeverityLevel } from '../models/disaster.model';
import { WebSocketService } from '../services/websocket.service';

@Component({
  selector: 'app-admin-verify-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-verify-alerts.component.html',
  styleUrls: ['./admin-verify-alerts.component.css']
})
export class AdminVerifyAlertsComponent implements OnInit {
  pendingDisasters: DisasterEvent[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  editingDisaster: DisasterEvent | null = null;
  disasterTypes = Object.values(DisasterType);
  severityLevels = Object.values(SeverityLevel);

  constructor(
    private disasterService: DisasterService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit() {
    this.loadPendingDisasters();
  }

  loadPendingDisasters() {
    this.loading = true;
    this.errorMessage = '';
    
    this.disasterService.getPendingDisasters().subscribe({
      next: (disasters) => {
        this.pendingDisasters = disasters;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to load pending disasters';
        console.error('Error:', error);
      }
    });
  }

  approveDisaster(id: number) {
    this.disasterService.approveDisaster(id).subscribe({
      next: () => {
        this.successMessage = 'Disaster approved successfully';
        this.pendingDisasters = this.pendingDisasters.filter(d => d.id !== id);
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to approve disaster';
        console.error('Error:', error);
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  rejectDisaster(id: number) {
    if (confirm('Are you sure you want to reject this disaster alert?')) {
      this.disasterService.rejectDisaster(id).subscribe({
        next: () => {
          this.successMessage = 'Disaster rejected successfully';
          this.pendingDisasters = this.pendingDisasters.filter(d => d.id !== id);
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = 'Failed to reject disaster';
          console.error('Error:', error);
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }

  resolveDisaster(id: number) {
    if (confirm('Mark this disaster as resolved?')) {
      this.disasterService.resolveDisaster(id).subscribe({
        next: () => {
          this.successMessage = 'Disaster marked as resolved';
          this.loadPendingDisasters();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = 'Failed to resolve disaster';
          console.error('Error:', error);
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }

  startEdit(disaster: DisasterEvent) {
    this.editingDisaster = { ...disaster };
  }

  cancelEdit() {
    this.editingDisaster = null;
  }

  saveEdit() {
    if (!this.editingDisaster) return;
    
    this.disasterService.updateDisaster(this.editingDisaster.id, this.editingDisaster).subscribe({
      next: (updated) => {
        this.successMessage = 'Disaster updated successfully';
        const index = this.pendingDisasters.findIndex(d => d.id === updated.id);
        if (index !== -1) {
          this.pendingDisasters[index] = updated;
        }
        this.editingDisaster = null;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to update disaster';
        console.error('Error:', error);
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }
}