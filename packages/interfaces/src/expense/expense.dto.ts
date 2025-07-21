// One-Time Expense Interfaces
export interface IOneTimeExpense {
  id: string;
  name: string;
  contragentId?: string | null;
  expenseDate: string;
  amount: number;
  inventoryId: string;
  userPaymentMethodId: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateOneTimeExpenseRequest {
  name: string;
  contragentId?: string | null;
  expenseDate: string;
  amount: number;
  inventoryId: string;
  userPaymentMethodId: string;
  note?: string;
}

export interface IUpdateOneTimeExpenseRequest {
  name?: string;
  contragentId?: string | null;
  expenseDate?: string;
  amount?: number;
  inventoryId?: string;
  userPaymentMethodId?: string;
  note?: string;
}

export interface IOneTimeExpenseResponse extends IOneTimeExpense {} 