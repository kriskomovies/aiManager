// Monthly Fee Payment Basis Enum
export enum FeePaymentBasis {
  APARTMENT = 'apartment',
  RESIDENT = 'resident',
  PET = 'pet',
  COMMON_PARTS = 'common_parts',
  QUADRATURE = 'quadrature',
}

// Monthly Fee Application Mode
export enum FeeApplicationMode {
  MONTHLY_FEE = 'monthly_fee', // Same amount for all
  TOTAL = 'total', // Total amount divided across apartments
}

// Base Monthly Fee interface
export interface IMonthlyFee {
  id: string;
  buildingId: string;
  name: string;
  paymentBasis: FeePaymentBasis;
  applicationMode: FeeApplicationMode;
  baseAmount: number;
  isDistributedEvenly: boolean;
  targetMonth?: string; // YYYY-MM format
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Monthly Fee Per Apartment
export interface IMonthlyFeeApartment {
  id: string;
  monthlyFeeId: string;
  apartmentId: string;
  coefficient: number;
  amount: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Create Monthly Fee Request
export interface ICreateMonthlyFeeRequest {
  buildingId: string;
  name: string;
  paymentBasis: FeePaymentBasis;
  applicationMode: FeeApplicationMode;
  baseAmount: number;
  isDistributedEvenly: boolean;
  targetMonth?: string;
  apartments: Array<{
    apartmentId: string;
    coefficient: number;
    description?: string;
    isSelected: boolean;
  }>;
}

// Update Monthly Fee Request
export interface IUpdateMonthlyFeeRequest {
  name?: string;
  paymentBasis?: FeePaymentBasis;
  applicationMode?: FeeApplicationMode;
  baseAmount?: number;
  isDistributedEvenly?: boolean;
  targetMonth?: string;
  isActive?: boolean;
}

// Monthly Fee Response
export interface IMonthlyFeeResponse extends IMonthlyFee {
  apartments: IMonthlyFeeApartment[];
  building?: {
    id: string;
    name: string;
    address: string;
  };
}

// Monthly Fee List Item
export interface IMonthlyFeeListItem {
  id: string;
  buildingId: string;
  buildingName: string;
  name: string;
  paymentBasis: FeePaymentBasis;
  applicationMode: FeeApplicationMode;
  baseAmount: number;
  totalAmount: number;
  apartmentCount: number;
  targetMonth?: string;
  isActive: boolean;
  createdAt: string;
}

// Monthly Fee Statistics
export interface IMonthlyFeeStats {
  totalFees: number;
  activeFees: number;
  totalAmount: number;
  averageAmount: number;
  apartmentsCovered: number;
  lastFeeCreated?: string;
}

// Monthly Fee Query Parameters
export interface IMonthlyFeeQueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  search?: string;
  buildingId?: string;
  paymentBasis?: FeePaymentBasis;
  applicationMode?: FeeApplicationMode;
  isActive?: boolean;
  targetMonth?: string;
}

// Backend API Response Types
export interface IBackendMonthlyFeeApartment {
  id: string;
  monthlyFeeId: string;
  apartmentId: string;
  coefficient: string | number;
  calculatedAmount: string | number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  apartment?: {
    id: string;
    buildingId: string;
    type: string;
    number: string;
    floor: number;
    quadrature: string | number;
    status: string;
  };
}

export interface IBackendMonthlyFeeResponse {
  id: string;
  buildingId: string;
  name: string;
  paymentBasis: FeePaymentBasis;
  applicationMode: FeeApplicationMode;
  baseAmount: string | number;
  isDistributedEvenly: boolean;
  targetMonth?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  apartments?: IBackendMonthlyFeeApartment[];
  building?: {
    id: string;
    name: string;
    address: string;
  };
}

export interface IBackendMonthlyFeeStatsResponse {
  totalFees: number;
  activeFees: number;
  totalAmount: string | number;
  averageAmount: string | number;
  apartmentsCovered: number;
  lastFeeCreated?: string;
}

export interface IBackendMonthlyFeeApiResponse<T> {
  data: T;
  statusCode: number;
  timestamp: string;
}

export interface IBackendMonthlyFeeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  buildingId?: string;
  paymentBasis?: string;
  applicationMode?: string;
  isActive?: boolean;
  targetMonth?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface IBuildingApartmentFeesResponse {
  apartment: {
    id: string;
    number: string;
    floor: number;
    residentsCount: number;
    status: string;
  };
  resident: {
    name: string;
    isMainContact: boolean;
  } | null;
  fees: {
    id: string;
    name: string;
    amount: number;
    coefficient: number;
    description: string | null;
    paymentBasis: string;
    applicationMode: string;
  }[];
  summary: {
    totalMonthlyAmount: number;
    totalPaid: number;
    totalOwed: number;
    balance: number;
  };
}
