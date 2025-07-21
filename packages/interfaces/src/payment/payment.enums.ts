// Tenant Payment Methods Enum
export enum TenantPaymentMethod {
  CASHIER = 'cashier',
  DEPOSIT = 'deposit',
  BANK_ACCOUNT = 'bank_account',
  E_PAY = 'e_pay',
  EASY_PAY = 'easy_pay',
  EXPENSE_REFUND = 'expense_refund',
  APP_PAYMENT = 'app_payment',
}

// User Payment Methods Enum
export enum UserPaymentMethod {
  BANK_ACCOUNT = 'bank_account',
  CASH = 'cash',
  EASY_PAY = 'easy_pay',
  E_PAY = 'e_pay',
}

// Payment Method Status
export enum PaymentMethodStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
