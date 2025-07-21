import {
  BuildingType,
  TaxGenerationPeriod,
  BuildingStatus,
} from './building.enums';

// Base Building interface
export interface IBuilding {
  id: string;
  name: string;
  type: BuildingType;

  // Address information
  city: string;
  district: string;
  street: string;
  number: string;
  entrance?: string;
  postalCode: string;

  // Physical properties
  commonPartsArea?: number;
  quadrature?: number;
  parkingSlots?: number;
  basements?: number;
  apartmentCount: number;

  // Financial information
  balance: number;
  monthlyFee: number;
  debt: number;

  // Tax settings
  taxGenerationPeriod: TaxGenerationPeriod;
  taxGenerationDay: number;
  homebookStartDate: string;

  // Features
  invoiceEnabled: boolean;

  // Status and metadata
  status: BuildingStatus;
  description?: string;
  irregularities: number;
  createdAt: string;
  updatedAt: string;
}

// Create Building DTO (matches the form fields from add-building.tsx)
export interface ICreateBuildingRequest {
  // General Information
  name: string;
  type: BuildingType;
  city: string;
  district: string;
  street: string;
  number: string;
  entrance?: string;
  postalCode: string;

  // Physical properties
  commonPartsArea?: number;
  quadrature?: number;
  parkingSlots?: number;
  basements?: number;

  // Tax settings
  taxGenerationPeriod: TaxGenerationPeriod;
  taxGenerationDay: number;
  homebookStartDate: string;

  // Features
  invoiceEnabled: boolean;

  // Optional
  description?: string;

  // People with access (user IDs)
  peopleWithAccess: string[];
}

// Update Building DTO
export interface IUpdateBuildingRequest {
  name?: string;
  type?: BuildingType;
  city?: string;
  district?: string;
  street?: string;
  number?: string;
  entrance?: string;
  postalCode?: string;
  commonPartsArea?: number;
  quadrature?: number;
  parkingSlots?: number;
  basements?: number;
  taxGenerationPeriod?: TaxGenerationPeriod;
  taxGenerationDay?: number;
  homebookStartDate?: string;
  invoiceEnabled?: boolean;
  description?: string;
  status?: BuildingStatus;
  peopleWithAccess?: string[];
}

// Building Response DTO
export interface IBuildingResponse extends IBuilding {
  // Computed address field for display
  address: string;

  // Additional populated fields
  peopleWithAccess?: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
}

// Building List Item (for tables/lists)
export interface IBuildingListItem {
  id: string;
  name: string;
  address: string;
  type: BuildingType;
  apartmentCount: number;
  balance: number;
  monthlyFee: number;
  debt: number;
  irregularities: number;
  status: BuildingStatus;
  createdAt: string;
}

// Building Query Parameters
export interface IBuildingQueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  search?: string;
  type?: BuildingType;
  city?: string;
  district?: string;
  status?: BuildingStatus;
  hasDebt?: boolean;
}

// Backend API Response Types
export interface IBackendBuildingResponse {
  id: string;
  name: string;
  type: BuildingType;
  city: string;
  district: string;
  street: string;
  number: string;
  entrance?: string;
  postalCode: string;
  commonPartsArea?: number;
  quadrature?: number;
  parkingSlots?: number;
  basements?: number;
  apartmentCount?: number;
  totalUnits?: number;
  balance: string | number;
  monthlyFee: string | number;
  debt: string | number;
  taxGenerationPeriod: TaxGenerationPeriod;
  taxGenerationDay: number;
  homebookStartDate: string;
  invoiceEnabled: boolean;
  status: BuildingStatus;
  description?: string;
  irregularities?: number;
  createdAt: string;
  updatedAt: string;
  peopleWithAccess?: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
}

export interface IBackendBuildingStatsResponse {
  buildingId: string;
  buildingName: string;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  occupancyRate: number;
  monthlyRevenue: string | number;
  annualRevenue: string | number;
  isFullyOccupied: boolean;
  canGenerateTax: boolean;
  nextTaxDate: string;
}

export interface IBackendBuildingApiResponse<T> {
  data: T;
  statusCode: number;
  timestamp: string;
}

export interface IBackendBuildingQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
  type?: BuildingType;
  status?: BuildingStatus;
  minOccupancyRate?: number;
  maxOccupancyRate?: number;
}
