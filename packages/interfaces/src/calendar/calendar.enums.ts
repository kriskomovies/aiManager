export enum CalendarEventType {
  MEETING = 'meeting',
  MAINTENANCE = 'maintenance',
  INSPECTION = 'inspection',
  PAYMENT = 'payment',
  REPAIR = 'repair',
}

export enum CalendarEventStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum CalendarEventPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}
