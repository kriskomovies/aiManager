import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithOnQueryStarted } from '@/lib/api.utils';
import {
  IRecurringExpenseResponse,
  IBackendRecurringExpenseResponse,
  ICreateRecurringExpenseRequest,
  IUpdateRecurringExpenseRequest,
} from '@repo/interfaces';
import { monthlyFeeService } from './monthly-fee.service';

export const recurringExpenseService = createApi({
  reducerPath: 'recurringExpenseService',
  baseQuery: baseQueryWithOnQueryStarted,
  tagTypes: ['RecurringExpense'],
  endpoints: builder => ({
    createRecurringExpense: builder.mutation<
      IRecurringExpenseResponse,
      ICreateRecurringExpenseRequest
    >({
      query: data => ({
        url: 'recurring-expenses',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: { data: IBackendRecurringExpenseResponse, statusCode: number, timestamp: string }): IRecurringExpenseResponse => {
        console.log('Create recurring expense API response:', response);
        
        // The response is now wrapped by TransformInterceptor
        const data = response.data;
        console.log('Processed create data:', data);
        
        return {
          ...data,
          monthlyAmount: data.monthlyAmount ? parseFloat(data.monthlyAmount.toString()) : 0,
          monthlyFee: data.monthlyFee ? {
            ...data.monthlyFee,
            baseAmount: data.monthlyFee.baseAmount ? parseFloat(data.monthlyFee.baseAmount.toString()) : 0,
          } : undefined,
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // If creating a new monthly fee, invalidate the monthly fee service cache
          if (arg.addToMonthlyFees) {
            dispatch(
              monthlyFeeService.util.invalidateTags(['MonthlyFee'])
            );
          }
        } catch {
          // Handle error if needed
        }
      },
      invalidatesTags: ['RecurringExpense'],
    }),

    getRecurringExpenses: builder.query<IRecurringExpenseResponse[], void>({
      query: () => 'recurring-expenses',
      transformResponse: (
        response: { data: IBackendRecurringExpenseResponse[], statusCode: number, timestamp: string }
      ): IRecurringExpenseResponse[] => {
        console.log('All recurring expenses API response:', response);
        
        // The response is now wrapped by TransformInterceptor
        const data = response.data;
        console.log('Processed data:', data);
        
        if (!Array.isArray(data)) {
          console.error('Data is not an array:', data);
          return [];
        }
        
        return data.map(expense => ({
          ...expense,
          monthlyAmount: parseFloat(expense.monthlyAmount.toString()),
          monthlyFee: expense.monthlyFee ? {
            ...expense.monthlyFee,
            baseAmount: parseFloat(expense.monthlyFee.baseAmount.toString()),
          } : undefined,
        }));
      },
      providesTags: ['RecurringExpense'],
    }),

    getRecurringExpensesByBuilding: builder.query<IRecurringExpenseResponse[], string>({
      query: buildingId => `recurring-expenses/building/${buildingId}`,
      transformResponse: (
        response: { data: IBackendRecurringExpenseResponse[], statusCode: number, timestamp: string }
      ): IRecurringExpenseResponse[] => {
        console.log('Recurring expenses API response:', response);
        
        // The response is now wrapped by TransformInterceptor
        const data = response.data;
        console.log('Processed data:', data);
        console.log('Data is array:', Array.isArray(data));
        console.log('Data length:', data.length);
        
        if (!Array.isArray(data)) {
          console.error('Data is not an array:', data);
          return [];
        }
        
        return data.map(expense => ({
          ...expense,
          monthlyAmount: parseFloat(expense.monthlyAmount.toString()),
          monthlyFee: expense.monthlyFee ? {
            ...expense.monthlyFee,
            baseAmount: parseFloat(expense.monthlyFee.baseAmount.toString()),
          } : undefined,
        }));
      },
      providesTags: (_, __, buildingId) => [
        { type: 'RecurringExpense', id: `building-${buildingId}` },
      ],
    }),

    updateRecurringExpense: builder.mutation<
      IRecurringExpenseResponse,
      { id: string; data: IUpdateRecurringExpenseRequest }
    >({
      query: ({ id, data }) => ({
        url: `recurring-expenses/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: { data: IBackendRecurringExpenseResponse, statusCode: number, timestamp: string }): IRecurringExpenseResponse => {
        console.log('Update recurring expense API response:', response);
        
        // The response is now wrapped by TransformInterceptor
        const data = response.data;
        
        return {
          ...data,
          monthlyAmount: data.monthlyAmount ? parseFloat(data.monthlyAmount.toString()) : 0,
          monthlyFee: data.monthlyFee ? {
            ...data.monthlyFee,
            baseAmount: data.monthlyFee.baseAmount ? parseFloat(data.monthlyFee.baseAmount.toString()) : 0,
          } : undefined,
        };
      },
      invalidatesTags: ['RecurringExpense'],
    }),

    deleteRecurringExpense: builder.mutation<void, string>({
      query: id => ({
        url: `recurring-expenses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['RecurringExpense'],
    }),
  }),
});

export const {
  useCreateRecurringExpenseMutation,
  useGetRecurringExpensesQuery,
  useGetRecurringExpensesByBuildingQuery,
  useUpdateRecurringExpenseMutation,
  useDeleteRecurringExpenseMutation,
} = recurringExpenseService;
