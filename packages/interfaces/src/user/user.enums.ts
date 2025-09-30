export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum SystemRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  ACCOUNTANT = 'accountant',
  CASHIER = 'cashier',
  RESIDENT = 'resident',
  MAINTENANCE = 'maintenance',
}

export enum UserPermission {
  // Building permissions
  BUILDINGS_READ = 'buildings.read',
  BUILDINGS_WRITE = 'buildings.write',
  BUILDINGS_DELETE = 'buildings.delete',

  // Apartment permissions
  APARTMENTS_READ = 'apartments.read',
  APARTMENTS_WRITE = 'apartments.write',
  APARTMENTS_DELETE = 'apartments.delete',

  // User management
  USERS_READ = 'users.read',
  USERS_WRITE = 'users.write',
  USERS_DELETE = 'users.delete',

  // Irregularities
  IRREGULARITIES_READ = 'irregularities.read',
  IRREGULARITIES_WRITE = 'irregularities.write',
  IRREGULARITIES_DELETE = 'irregularities.delete',
  IRREGULARITIES_ASSIGN = 'irregularities.assign',

  // Financial
  FINANCES_READ = 'finances.read',
  FINANCES_WRITE = 'finances.write',

  // Reports
  REPORTS_READ = 'reports.read',
  REPORTS_GENERATE = 'reports.generate',

  // Partners
  PARTNERS_READ = 'partners.read',
  PARTNERS_WRITE = 'partners.write',
  PARTNERS_DELETE = 'partners.delete',

  // System admin
  SYSTEM_ADMIN = 'system.admin',
  ALL = '*',
}
