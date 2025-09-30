export enum IrregularityStatus {
  REPORTED = 'reported',      // докладвана
  PLANNED = 'planned',        // планувана  
  IN_PROGRESS = 'in_progress', // в процес
  COMPLETED = 'completed',    // решена
  REJECTED = 'rejected',      // отказана
}

export enum IrregularityPriority {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high',
  URGENT = 'urgent',
}
