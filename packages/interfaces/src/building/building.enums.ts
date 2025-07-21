// Building Type Enum
export enum BuildingType {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  OFFICE = 'office',
  MIXED = 'mixed',
}

// Tax Generation Period Enum
export enum TaxGenerationPeriod {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

// Building Status Enum
export enum BuildingStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

// User Role Enum for people with access
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  ACCOUNTANT = 'accountant',
  RESIDENT = 'resident',
  OWNER = 'owner',
}
