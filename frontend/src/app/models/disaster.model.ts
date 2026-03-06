export enum DisasterType {
  FLOOD = 'FLOOD',
  CYCLONE = 'CYCLONE',
  EARTHQUAKE = 'EARTHQUAKE',
  FIRE = 'FIRE',
  STORM = 'STORM'
}

export enum SeverityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum DisasterStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  RESOLVED = 'RESOLVED'
}

export interface DisasterEvent {
  id: number;
  title: string;
  description: string;
  disasterType: DisasterType;
  severity: SeverityLevel;
  latitude: number;
  longitude: number;
  locationName: string;
  source: string;
  magnitude?: number;
  eventTime: Date;
  status: DisasterStatus;
  createdAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  alertSent?: boolean;
}

export interface DisasterFilter {
  type?: DisasterType;
  severity?: SeverityLevel;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  liveOnly?: boolean;
  page: number;
  size: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}