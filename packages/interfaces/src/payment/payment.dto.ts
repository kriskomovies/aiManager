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

// Recurring Expense Payment interfaces
export interface IRecurringExpensePayment {
  id: string;
  name: string;
  amount: number;
  recurringExpenseId: string;
  userPaymentMethodId: string;
  connectPayment: boolean;
  monthlyFeeId?: string;
  reason?: string;
  paymentDate: string;
  issueDocument: boolean;
  documentType?: 'invoice' | 'receipt';
  createdAt: string;
  updatedAt: string;
}

// Create Recurring Expense Payment DTO
export interface ICreateRecurringExpensePaymentRequest {
  name: string;
  amount: number;
  recurringExpenseId: string;
  userPaymentMethodId: string;
  connectPayment: boolean;
  monthlyFeeId?: string;
  reason?: string;
  paymentDate: string;
  issueDocument: boolean;
  documentType?: 'invoice' | 'receipt';
}

// Update Recurring Expense Payment DTO
export interface IUpdateRecurringExpensePaymentRequest {
  name?: string;
  amount?: number;
  userPaymentMethodId?: string;
  connectPayment?: boolean;
  monthlyFeeId?: string;
  reason?: string;
  paymentDate?: string;
  issueDocument?: boolean;
  documentType?: 'invoice' | 'receipt';
}

// Backend Response with populated relations
export interface IBackendRecurringExpensePaymentResponse {
  id: string;
  name: string;
  amount: number;
  recurringExpenseId: string;
  userPaymentMethodId: string;
  connectPayment: boolean;
  monthlyFeeId?: string;
  reason?: string;
  paymentDate: string;
  issueDocument: boolean;
  documentType?: 'invoice' | 'receipt';
  createdAt: string;
  updatedAt: string;
  userPaymentMethod: IUserPaymentMethodResponse;
  monthlyFee?: {
    id: string;
    name: string;
    baseAmount: number;
  };
}

// Frontend Response (transformed)
export interface IRecurringExpensePaymentResponse extends IRecurringExpensePayment {
  userPaymentMethod: IUserPaymentMethodResponse;
  monthlyFee?: {
    id: string;
    name: string;
    baseAmount: number;
  };
}
