import { TransactionType } from './inventory.enums';

// Base Inventory interface
export interface IInventory {
  id: string;
  buildingId: string;
  name: string;
  title?: string;
  description?: string;
  amount: number;
  isMain: boolean;
  visibleInApp: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// Create Inventory DTO
export interface ICreateInventoryRequest {
  buildingId: string;
  name: string;
  title?: string;
  description?: string;
  visibleInApp?: boolean;
  initialAmount?: number;
}

// Update Inventory DTO
export interface IUpdateInventoryRequest {
  name?: string;
  title?: string;
  description?: string;
  visibleInApp?: boolean;
}

// Inventory Transfer DTO
export interface IInventoryTransferRequest {
  fromInventoryId: string;
  toInventoryId: string;
  amount: number;
  description?: string;
  userPaymentMethodId?: string;
}

// Inventory Transaction interface
export interface IInventoryTransaction {
  id: string;
  fromInventoryId?: string;
  toInventoryId?: string;
  userPaymentMethodId?: string;
  type: TransactionType;
  amount: number;
  description?: string;
  referenceId?: string;
  createdAt: string;
  createdBy?: string;
  fromInventory?: Partial<IInventory>;
  toInventory?: Partial<IInventory>;
  userPaymentMethod?: {
    id: string;
    method: string;
    displayName: string;
  };
}

// Inventory Response DTO
export interface IInventoryResponse extends IInventory {
  building?: {
    id: string;
    name: string;
    address: string;
  };
  totalTransactions?: number;
  lastTransactionDate?: string;
}

// Inventory List Item (for tables/lists)
export interface IInventoryListItem {
  id: string;
  buildingId: string;
  name: string;
  title?: string;
  amount: number;
  isMain: boolean;
  visibleInApp: boolean;
  createdAt: string;
}

// Inventory Statistics
export interface IInventoryStats {
  totalAmount: number;
  mainCashAmount: number;
  customInventoriesTotal: number;
  inventoryCount: number;
  transactionCount: number;
  lastTransactionDate?: string;
}

// Inventory Query Parameters
export interface IInventoryQueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  search?: string;
  buildingId?: string;
  isMain?: boolean;
  visibleInApp?: boolean;
}

// Inventory Transaction Query Parameters
export interface IInventoryTransactionQueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  inventoryId?: string;
  type?: TransactionType;
  fromDate?: string;
  toDate?: string;
  userPaymentMethodId?: string;
}

// Backend API Response Types
export interface IBackendInventoryResponse {
  id: string;
  buildingId: string;
  name: string;
  title?: string;
  description?: string;
  amount: string | number;
  isMain: boolean;
  visibleInApp: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface IBackendTransactionResponse {
  id: string;
  fromInventoryId?: string;
  toInventoryId?: string;
  userPaymentMethodId?: string;
  type: string;
  amount: string | number;
  description?: string;
  referenceId?: string;
  createdAt: string;
  createdBy?: string;
}

export interface IBackendStatsResponse {
  totalAmount: string | number;
  mainCashAmount: string | number;
  customInventoriesTotal: string | number;
  inventoryCount: number;
  transactionCount: number;
  lastTransactionDate?: string;
}

export interface IBackendQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  buildingId?: string;
  isMain?: boolean;
  visibleInApp?: boolean;
  sortBy?: string;
  sortOrder?: string;
  type?: string;
  fromDate?: string;
  toDate?: string;
  userPaymentMethodId?: string;
}
