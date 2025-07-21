import {
  TenantPaymentMethod,
  UserPaymentMethod,
  PaymentMethodStatus,
} from './payment.enums';

// Base Tenant Payment Method interface
export interface ITenantPaymentMethod {
  id: string;
  method: TenantPaymentMethod;
  displayName: string;
  description?: string;
  status: PaymentMethodStatus;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Base User Payment Method interface
export interface IUserPaymentMethod {
  id: string;
  method: UserPaymentMethod;
  displayName: string;
  description?: string;
  status: PaymentMethodStatus;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Create Tenant Payment Method DTO
export interface ICreateTenantPaymentMethodRequest {
  method: TenantPaymentMethod;
  displayName: string;
  description?: string;
  status?: PaymentMethodStatus;
  isDefault?: boolean;
}

// Create User Payment Method DTO
export interface ICreateUserPaymentMethodRequest {
  method: UserPaymentMethod;
  displayName: string;
  description?: string;
  status?: PaymentMethodStatus;
  isDefault?: boolean;
}

// Update Tenant Payment Method DTO
export interface IUpdateTenantPaymentMethodRequest {
  displayName?: string;
  description?: string;
  status?: PaymentMethodStatus;
  isDefault?: boolean;
}

// Update User Payment Method DTO
export interface IUpdateUserPaymentMethodRequest {
  displayName?: string;
  description?: string;
  status?: PaymentMethodStatus;
  isDefault?: boolean;
}

// Payment Method Response for API
export interface ITenantPaymentMethodResponse extends ITenantPaymentMethod {}
export interface IUserPaymentMethodResponse extends IUserPaymentMethod {}
