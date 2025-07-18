import { ApartmentType, ApartmentStatus, ResidentRole } from './apartment.enums';

// Base Apartment interface
export interface IApartment {
  id: string;
  buildingId: string;
  
  // Basic Information
  type: ApartmentType;
  number: string;
  floor: number;
  quadrature: number;
  commonParts?: number;
  idealParts?: number;
  
  // Residents Information
  residentsCount: number;
  pets: number;
  
  // Status and Settings
  status: ApartmentStatus;
  invoiceEnabled: boolean;
  blockForPayment: boolean;
  cashierNote?: string;
  
  // Financial Information
  monthlyRent?: number;
  maintenanceFee?: number;
  debt?: number;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// Resident interface
export interface IResident {
  id: string;
  apartmentId: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  role: ResidentRole;
  isMainContact: boolean;
  createdAt: string;
  updatedAt: string;
}

// Create Apartment DTO
export interface ICreateApartmentRequest {
  buildingId: string;
  
  // Basic Information
  type: ApartmentType;
  number: string;
  floor: number;
  quadrature: number;
  commonParts?: number;
  idealParts?: number;
  
  // Residents Information
  residentsCount: number;
  pets: number;
  
  // Settings
  invoiceEnabled: boolean;
  blockForPayment: boolean;
  cashierNote?: string;
  
  // Financial Information
  monthlyRent?: number;
  maintenanceFee?: number;
  
  // Residents data
  residents: Array<{
    name: string;
    surname: string;
    phone: string;
    email: string;
    role: ResidentRole;
    isMainContact: boolean;
  }>;
}

// Update Apartment DTO
export interface IUpdateApartmentRequest {
  type?: ApartmentType;
  number?: string;
  floor?: number;
  quadrature?: number;
  commonParts?: number;
  idealParts?: number;
  residentsCount?: number;
  pets?: number;
  status?: ApartmentStatus;
  invoiceEnabled?: boolean;
  blockForPayment?: boolean;
  cashierNote?: string;
  monthlyRent?: number;
  maintenanceFee?: number;
  debt?: number;
}

// Apartment Response DTO
export interface IApartmentResponse extends IApartment {
  building?: {
    id: string;
    name: string;
    address: string;
  };
  residents?: IResident[];
}

// Apartment List Item (for tables/lists)
export interface IApartmentListItem {
  id: string;
  buildingId: string;
  buildingName: string;
  type: ApartmentType;
  number: string;
  floor: number;
  quadrature: number;
  residentsCount: number;
  status: ApartmentStatus;
  monthlyRent?: number;
  debt?: number;
  createdAt: string;
}

// Apartment Query Parameters
export interface IApartmentQueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  search?: string;
  buildingId?: string;
  type?: ApartmentType;
  status?: ApartmentStatus;
  floor?: number;
  hasDebt?: boolean;
  minQuadrature?: number;
  maxQuadrature?: number;
}

// Apartment Statistics
export interface IApartmentStats {
  totalApartments: number;
  occupiedApartments: number;
  vacantApartments: number;
  maintenanceApartments: number;
  reservedApartments: number;
  occupancyRate: number;
  totalDebt: number;
  totalMonthlyRevenue: number;
  averageQuadrature: number;
  totalQuadrature: number;
  apartmentsWithDebt: number;
  averageRent: number;
  totalResidents: number;
  totalPets: number;
}

// Backend API Response Types
export interface IBackendApartmentResponse {
  id: string;
  buildingId: string;
  type: ApartmentType;
  number: string;
  floor: number;
  quadrature: string | number;
  commonParts?: string | number;
  idealParts?: string | number;
  residentsCount: number;
  pets: number;
  status: ApartmentStatus;
  invoiceEnabled: boolean;
  blockForPayment: boolean;
  cashierNote?: string;
  monthlyRent?: string | number;
  maintenanceFee?: string | number;
  debt?: string | number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  building?: {
    id: string;
    name: string;
    address: string;
  };
  residents?: Array<{
    id: string;
    apartmentId: string;
    name: string;
    surname: string;
    phone: string;
    email: string;
    role: ResidentRole;
    isMainContact: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface IBackendApartmentStatsResponse {
  totalApartments: number;
  occupiedApartments: number;
  vacantApartments: number;
  maintenanceApartments: number;
  reservedApartments: number;
  occupancyRate: number;
  totalDebt: string | number;
  totalMonthlyRevenue: string | number;
  averageQuadrature: string | number;
  totalQuadrature: string | number;
  apartmentsWithDebt: number;
  averageRent: string | number;
  totalResidents: number;
  totalPets: number;
}

export interface IBackendApartmentApiResponse<T> {
  data: T;
  statusCode: number;
  timestamp: string;
}

export interface IBackendApartmentQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
  buildingId?: string;
  type?: ApartmentType;
  status?: ApartmentStatus;
  floor?: number;
  hasDebt?: boolean;
  minQuadrature?: number;
  maxQuadrature?: number;
} 