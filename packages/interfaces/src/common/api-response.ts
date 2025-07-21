// Standard API response wrapper
export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  timestamp: string;
}

// Error response
export interface IApiError {
  success: false;
  message: string;
  errors?: string[];
  statusCode: number;
  timestamp: string;
}

// Success response
export interface IApiSuccess<T = any> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
}
