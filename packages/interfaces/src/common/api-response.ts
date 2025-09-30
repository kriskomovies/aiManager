// Backend API response interfaces
export interface IBackendPaginatedResponse<T> {
  data: {
    data: T[];
    page: number;
    limit: number;
    totalPages: number;
    total: number;
  };
}

export interface IBackendApiResponse<T> {
  data: T;
}

// Backend user data structure
export interface IBackendUserData {
  id: string;
  email: string;
  name: string;
  surname: string;
  phone?: string;
  status: string;
  isUsingMobileApp: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  residentId?: string;
  role?: {
    id: string;
    name: string;
    permissions: string[];
  };
  resident?: {
    id: string;
    name: string;
    surname: string;
    apartmentId: string;
    apartment?: {
      number: string;
      building?: {
        name: string;
      };
    };
  };
}
