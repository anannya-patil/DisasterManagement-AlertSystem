import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DisasterType, SeverityLevel, DisasterFilter } from '../models/disaster.model';

@Component({
  selector: 'app-disaster-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './disaster-filters.component.html',
  styleUrls: ['./disaster-filters.component.css']
})
export class DisasterFiltersComponent implements OnInit {
  @Output() filterChange = new EventEmitter<DisasterFilter>();

  disasterTypes = Object.values(DisasterType);
  severityLevels = Object.values(SeverityLevel);

  filter: DisasterFilter = {
    page: 0,
    size: 10,
    liveOnly: false
  };

  locationInput = '';
  startDateInput = '';
  endDateInput = '';

  ngOnInit() {
    this.emitFilter();
  }

  onTypeChange(type: DisasterType) {
    this.filter.type = type;
    this.emitFilter();
  }

  onSeverityChange(severity: SeverityLevel) {
    this.filter.severity = severity;
    this.emitFilter();
  }

  onLocationSearch() {
    this.filter.location = this.locationInput;
    this.emitFilter();
  }

  onDateRangeChange() {
    if (this.startDateInput) {
      this.filter.startDate = new Date(this.startDateInput);
    }
    if (this.endDateInput) {
      this.filter.endDate = new Date(this.endDateInput);
    }
    this.emitFilter();
  }

  onLiveOnlyChange(liveOnly: boolean) {
    this.filter.liveOnly = liveOnly;
    this.emitFilter();
  }

  clearFilters() {
    this.filter = {
      page: 0,
      size: 10,
      liveOnly: false
    };
    this.locationInput = '';
    this.startDateInput = '';
    this.endDateInput = '';
    this.emitFilter();
  }

  emitFilter() {
    this.filterChange.emit(this.filter);
  }
}