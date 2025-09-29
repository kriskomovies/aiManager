// Recurring Expense Interfaces
export interface IRecurringExpense {
  id: string;
  buildingId: string;
  name: string;
  monthlyAmount: number;
  userPaymentMethodId: string;
  addToMonthlyFees: boolean;
  monthlyFeeId?: string; // Now optional
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  contractor?: string;
  paymentDate?: string;
  reason?: string;
}

export interface ICreateRecurringExpenseRequest {
  buildingId: string;
  name: string;
  monthlyAmount: number;
  userPaymentMethodId: string;
  addToMonthlyFees: boolean;
  monthlyFeeId?: string; // Optional when addToMonthlyFees is true
  contractor?: string;
  paymentDate?: string;
  reason?: string;
}

export interface IUpdateRecurringExpenseRequest {
  name?: string;
  monthlyAmount?: number;
  userPaymentMethodId?: string;
  addToMonthlyFees?: boolean;
  monthlyFeeId?: string;
  isActive?: boolean;
  contractor?: string;
  paymentDate?: string;
  reason?: string;
}

export interface IRecurringExpenseResponse extends IRecurringExpense {
  building?: {
    id: string;
    name: string;
    address: string;
  };
  monthlyFee?: {
    id: string;
    name: string;
    baseAmount: number;
  };
  userPaymentMethod?: {
    id: string;
    displayName: string;
    method: string;
  };
}

// Backend response interface (handles string/number conversion)
export interface IBackendRecurringExpenseResponse {
  id: string;
  buildingId: string;
  name: string;
  monthlyAmount: string | number;
  userPaymentMethodId: string;
  addToMonthlyFees: boolean;
  monthlyFeeId?: string; // Now optional
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  contractor?: string;
  paymentDate?: string;
  reason?: string;
  building?: {
    id: string;
    name: string;
    address: string;
  };
  monthlyFee?: {
    id: string;
    name: string;
    baseAmount: string | number;
  };
  userPaymentMethod?: {
    id: string;
    displayName: string;
    method: string;
  };
}
