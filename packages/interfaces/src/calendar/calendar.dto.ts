import {
  CalendarEventType,
  CalendarEventStatus,
  CalendarEventPriority,
} from './calendar.enums';

// Base Calendar Event interface
export interface ICalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  startDate: string; // ISO string
  endDate: string; // ISO string
  description?: string;
  status: CalendarEventStatus;
  priority: CalendarEventPriority;
  assignedTo?: string;

  // Building constraint - every event belongs to exactly ONE building
  buildingId: string;

  // Apartment targeting - mutually exclusive options:
  appliesToAllApartments: boolean; // Option 1: All apartments
  targetApartmentIds?: string[]; // Option 2: Specific apartments (1 or many)

  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// Create Calendar Event DTO
export interface ICreateCalendarEventRequest {
  title: string;
  type: CalendarEventType;
  startDate: string; // ISO string
  endDate: string; // ISO string
  description?: string;
  priority?: CalendarEventPriority;
  assignedTo?: string;

  // Building is REQUIRED
  buildingId: string;

  // Apartment targeting (mutually exclusive):
  appliesToAllApartments?: boolean; // If true, targets all apartments
  targetApartmentIds?: string[]; // If set, targets specific apartments

  location?: string;
  notes?: string;
}

// Update Calendar Event DTO
export interface IUpdateCalendarEventRequest {
  title?: string;
  type?: CalendarEventType;
  startDate?: string;
  endDate?: string;
  description?: string;
  status?: CalendarEventStatus;
  priority?: CalendarEventPriority;
  assignedTo?: string;

  // Cannot change building once event is created
  // buildingId is immutable after creation

  // Can update apartment targeting:
  appliesToAllApartments?: boolean;
  targetApartmentIds?: string[];

  location?: string;
  notes?: string;
}

// Calendar Event Response DTO
export interface ICalendarEventResponse extends ICalendarEvent {
  building: {
    id: string;
    name: string;
    address: string;
  };
  // Helper field for frontend - populated apartments info
  targetedApartments?: Array<{
    id: string;
    number: string;
    floor: number;
  }>;
}

// Calendar Event Query Parameters
export interface ICalendarEventQueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  search?: string;

  // Building filter - can only filter by ONE building at a time
  buildingId?: string;

  // Apartment and other filters
  type?: CalendarEventType;
  status?: CalendarEventStatus;
  priority?: CalendarEventPriority;
  startDate?: string;
  endDate?: string;
  assignedTo?: string;
  appliesToAllApartments?: boolean;
}

// Calendar Event Statistics
export interface ICalendarEventStats {
  totalEvents: number;
  scheduledEvents: number;
  inProgressEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  eventsByType: {
    meeting: number;
    maintenance: number;
    inspection: number;
    payment: number;
    repair: number;
  };
  eventsByPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  upcomingEvents: number;
  overdueEvents: number;
}

// Backend API Response Types
export interface IBackendCalendarEventResponse {
  id: string;
  title: string;
  type: CalendarEventType;
  startDate: string;
  endDate: string;
  description?: string;
  status: CalendarEventStatus;
  priority: CalendarEventPriority;
  assignedTo?: string;
  buildingId: string;
  appliesToAllApartments: boolean;
  targetApartmentIds?: string[];
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  building?: {
    id: string;
    name: string;
    address: string;
  };
  targetedApartments?: Array<{
    id: string;
    number: string;
    floor: number;
  }>;
}

export interface IBackendCalendarEventStatsResponse {
  totalEvents: number;
  scheduledEvents: number;
  inProgressEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  eventsByType: Record<string, number>;
  eventsByPriority: Record<string, number>;
  upcomingEvents: number;
  overdueEvents: number;
}

export interface IBackendCalendarEventApiResponse<T> {
  data: T;
  statusCode: number;
  timestamp: string;
}

export interface IBackendCalendarEventQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
  buildingId?: string;
  type?: CalendarEventType;
  status?: CalendarEventStatus;
  priority?: CalendarEventPriority;
  startDate?: string;
  endDate?: string;
  assignedTo?: string;
  appliesToAllApartments?: boolean;
}
