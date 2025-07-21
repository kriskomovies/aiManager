import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithOnQueryStarted } from '@/lib/api.utils';
import {
  IInventoryResponse,
  ICreateInventoryRequest,
  IUpdateInventoryRequest,
  IInventoryTransferRequest,
  IInventoryTransaction,
  IInventoryStats,
  IInventoryQueryParams,
  IInventoryTransactionQueryParams,
  IPaginatedResponse,
  IBackendTransactionResponse,
  IBackendStatsResponse,
  IBackendApiResponse,
  IBackendQueryParams,
  IBackendPaginatedResponse,
  IBackendInventoryResponse,
} from '@repo/interfaces';

// Transform backend response to frontend format
const transformPaginatedResponse = <T>(
  response: IBackendPaginatedResponse<T>
): IPaginatedResponse<T> => ({
  items: response.data.data,
  meta: {
    page: response.data.page,
    pageSize: response.data.limit,
    pageCount: response.data.totalPages,
    total: response.data.total,
  },
});

export const inventoryService = createApi({
  reducerPath: 'inventoryService',
  baseQuery: baseQueryWithOnQueryStarted,
  tagTypes: ['Inventory', 'InventoryTransaction', 'InventoryStats'],
  endpoints: builder => ({
    // Get inventories by building ID
    getInventoriesByBuilding: builder.query<IInventoryResponse[], string>({
      query: buildingId => `inventories/building/${buildingId}`,
      transformResponse: (
        response: IBackendApiResponse<IBackendInventoryResponse[]>
      ) => {
        return response.data.map((inventory: IBackendInventoryResponse) => ({
          ...inventory,
          amount: parseFloat(inventory.amount.toString()),
        }));
      },
      providesTags: ['Inventory'],
    }),

    // Get all inventories with pagination
    getInventories: builder.query<
      IPaginatedResponse<IInventoryResponse>,
      IInventoryQueryParams
    >({
      query: params => {
        const backendParams: IBackendQueryParams = {
          page: params.page,
          limit: params.pageSize,
          search: params.search,
          buildingId: params.buildingId,
          isMain: params.isMain,
          visibleInApp: params.visibleInApp,
        };

        // Transform sort parameter
        if (params.sort) {
          const [field, direction] = params.sort.split(':');
          backendParams.sortBy = field;
          backendParams.sortOrder = direction?.toUpperCase() || 'DESC';
        }

        // Remove undefined values
        Object.keys(backendParams).forEach(
          key =>
            backendParams[key as keyof IBackendQueryParams] === undefined &&
            delete backendParams[key as keyof IBackendQueryParams]
        );

        return {
          url: 'inventories',
          params: backendParams,
        };
      },
      transformResponse: (
        response: IBackendPaginatedResponse<IBackendInventoryResponse>
      ) => {
        const transformed = transformPaginatedResponse(response);

        // Transform each inventory
        const inventories: IInventoryResponse[] = (
          transformed.items as IBackendInventoryResponse[]
        ).map((inventory: IBackendInventoryResponse) => ({
          ...inventory,
          amount: parseFloat(inventory.amount.toString()),
        }));

        return {
          ...transformed,
          items: inventories,
        };
      },
      providesTags: ['Inventory'],
    }),

    // Get inventory by ID
    getInventoryById: builder.query<IInventoryResponse, string>({
      query: id => `inventories/${id}`,
      transformResponse: (
        response: IBackendApiResponse<IBackendInventoryResponse>
      ) => {
        const inventory = response.data;
        return {
          ...inventory,
          amount: parseFloat(inventory.amount.toString()),
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'Inventory', id }],
    }),

    // Create inventory
    createInventory: builder.mutation<
      IInventoryResponse,
      ICreateInventoryRequest
    >({
      query: inventory => ({
        url: 'inventories',
        method: 'POST',
        body: inventory,
      }),
      transformResponse: (
        response: IBackendApiResponse<IBackendInventoryResponse>
      ) => {
        const inventory = response.data;
        return {
          ...inventory,
          amount: parseFloat(inventory.amount.toString()),
        };
      },
      invalidatesTags: ['Inventory', 'InventoryStats'],
    }),

    // Update inventory
    updateInventory: builder.mutation<
      IInventoryResponse,
      { id: string; updates: IUpdateInventoryRequest }
    >({
      query: ({ id, updates }) => ({
        url: `inventories/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      transformResponse: (
        response: IBackendApiResponse<IBackendInventoryResponse>
      ) => {
        const inventory = response.data;
        return {
          ...inventory,
          amount: parseFloat(inventory.amount.toString()),
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Inventory', id },
        'Inventory',
        'InventoryStats',
      ],
    }),

    // Delete inventory
    deleteInventory: builder.mutation<void, string>({
      query: id => ({
        url: `inventories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Inventory', id },
        'Inventory',
        'InventoryStats',
      ],
    }),

    // Transfer money between inventories
    transferMoney: builder.mutation<
      IInventoryTransaction,
      IInventoryTransferRequest
    >({
      query: transfer => ({
        url: 'inventories/transfer',
        method: 'POST',
        body: transfer,
      }),
      transformResponse: (
        response: IBackendApiResponse<IBackendTransactionResponse>
      ) => {
        const transaction = response.data;
        return {
          ...transaction,
          amount: parseFloat(transaction.amount.toString()),
          type: transaction.type as IInventoryTransaction['type'],
        };
      },
      invalidatesTags: ['Inventory', 'InventoryTransaction', 'InventoryStats'],
    }),

    // Get inventory statistics
    getInventoryStats: builder.query<IInventoryStats, string>({
      query: buildingId => `inventories/building/${buildingId}/stats`,
      transformResponse: (
        response: IBackendApiResponse<IBackendStatsResponse>
      ) => {
        const stats = response.data;
        return {
          ...stats,
          totalAmount: parseFloat(stats.totalAmount.toString()),
          mainCashAmount: parseFloat(stats.mainCashAmount.toString()),
          customInventoriesTotal: parseFloat(
            stats.customInventoriesTotal.toString()
          ),
        };
      },
      providesTags: ['InventoryStats'],
    }),

    // Get inventory transactions
    getInventoryTransactions: builder.query<
      IPaginatedResponse<IInventoryTransaction>,
      { inventoryId: string; params?: IInventoryTransactionQueryParams }
    >({
      query: ({ inventoryId, params }) => {
        const backendParams: IBackendQueryParams = {
          page: params?.page,
          limit: params?.pageSize,
          type: params?.type,
          fromDate: params?.fromDate,
          toDate: params?.toDate,
        };

        // Transform sort parameter
        if (params?.sort) {
          const [field, direction] = params.sort.split(':');
          backendParams.sortBy = field;
          backendParams.sortOrder = direction?.toUpperCase() || 'DESC';
        }

        // Remove undefined values
        Object.keys(backendParams).forEach(
          key =>
            backendParams[key as keyof IBackendQueryParams] === undefined &&
            delete backendParams[key as keyof IBackendQueryParams]
        );

        return {
          url: `inventories/${inventoryId}/transactions`,
          params: backendParams,
        };
      },
      transformResponse: (
        response: IBackendPaginatedResponse<IBackendTransactionResponse>
      ) => {
        const transformed = transformPaginatedResponse(response);

        // Transform each transaction
        const transactions: IInventoryTransaction[] = (
          transformed.items as IBackendTransactionResponse[]
        ).map((transaction: IBackendTransactionResponse) => ({
          ...transaction,
          amount: parseFloat(transaction.amount.toString()),
          type: transaction.type as IInventoryTransaction['type'],
        }));

        return {
          ...transformed,
          items: transactions,
        };
      },
      providesTags: ['InventoryTransaction'],
    }),

    // Create expense transaction
    createExpense: builder.mutation<
      IInventoryTransaction,
      {
        sourceInventoryId: string;
        userPaymentMethodId: string;
        amount: number;
        description?: string;
      }
    >({
      query: ({
        sourceInventoryId,
        userPaymentMethodId,
        amount,
        description,
      }) => ({
        url: 'inventories/expense',
        method: 'POST',
        body: {
          sourceInventoryId,
          userPaymentMethodId,
          amount,
          description,
        },
      }),
      transformResponse: (
        response: IBackendApiResponse<IBackendTransactionResponse>
      ) => {
        const transaction = response.data;
        return {
          ...transaction,
          amount: parseFloat(transaction.amount.toString()),
          type: transaction.type as IInventoryTransaction['type'],
        };
      },
      invalidatesTags: ['Inventory', 'InventoryTransaction', 'InventoryStats'],
    }),
  }),
});

export const {
  useGetInventoriesByBuildingQuery,
  useGetInventoriesQuery,
  useGetInventoryByIdQuery,
  useCreateInventoryMutation,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
  useTransferMoneyMutation,
  useGetInventoryStatsQuery,
  useGetInventoryTransactionsQuery,
  useCreateExpenseMutation,
} = inventoryService;
