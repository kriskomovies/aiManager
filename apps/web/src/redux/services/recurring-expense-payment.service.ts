import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithOnQueryStarted } from '@/lib/api.utils';
import type {
  ICreateRecurringExpensePaymentRequest,
  IUpdateRecurringExpensePaymentRequest,
  IRecurringExpensePaymentResponse,
  IBackendRecurringExpensePaymentResponse,
} from '@repo/interfaces';

export const recurringExpensePaymentService = createApi({
  reducerPath: 'recurringExpensePaymentService',
  baseQuery: baseQueryWithOnQueryStarted,
  tagTypes: ['RecurringExpensePayment'],
  endpoints: (builder) => ({
    // Create a new recurring expense payment
    createRecurringExpensePayment: builder.mutation<
      IRecurringExpensePaymentResponse,
      ICreateRecurringExpensePaymentRequest
    >({
      query: (paymentData) => ({
        url: 'recurring-expense-payments',
        method: 'POST',
        body: paymentData,
      }),
      transformResponse: (response: { data: IBackendRecurringExpensePaymentResponse }) => {
        const payment = response.data;
        return {
          ...payment,
          amount: payment.amount ? Number(payment.amount.toString()) : 0,
        } as IRecurringExpensePaymentResponse;
      },
      invalidatesTags: ['RecurringExpensePayment'],
    }),

    // Get all payments
    getRecurringExpensePayments: builder.query<
      IRecurringExpensePaymentResponse[],
      void
    >({
      query: () => 'recurring-expense-payments',
      transformResponse: (response: { data: IBackendRecurringExpensePaymentResponse[] }) => {
        if (!response.data || !Array.isArray(response.data)) {
          console.warn('Payments data is not an array:', response);
          return [];
        }

        return response.data.map(payment => ({
          ...payment,
          amount: payment.amount ? Number(payment.amount.toString()) : 0,
        })) as IRecurringExpensePaymentResponse[];
      },
      providesTags: ['RecurringExpensePayment'],
    }),

    // Get payments for a specific recurring expense
    getPaymentsByRecurringExpense: builder.query<
      IRecurringExpensePaymentResponse[],
      string
    >({
      query: (recurringExpenseId) => `recurring-expense-payments/recurring-expense/${recurringExpenseId}`,
      transformResponse: (response: { data: IBackendRecurringExpensePaymentResponse[] }) => {
        if (!response.data || !Array.isArray(response.data)) {
          console.warn('Payments data is not an array:', response);
          return [];
        }

        return response.data.map(payment => ({
          ...payment,
          amount: payment.amount ? Number(payment.amount.toString()) : 0,
        })) as IRecurringExpensePaymentResponse[];
      },
      providesTags: (_result, _error, recurringExpenseId) => [
        { type: 'RecurringExpensePayment', id: recurringExpenseId },
      ],
    }),

    // Get payments for multiple recurring expenses
    getPaymentsByRecurringExpenses: builder.query<
      IRecurringExpensePaymentResponse[],
      string[]
    >({
      query: (recurringExpenseIds) => `recurring-expense-payments/by-expenses?ids=${recurringExpenseIds.join(',')}`,
      transformResponse: (response: { data: IBackendRecurringExpensePaymentResponse[] }) => {
        if (!response.data || !Array.isArray(response.data)) {
          console.warn('Payments data is not an array:', response);
          return [];
        }

        return response.data.map(payment => ({
          ...payment,
          amount: payment.amount ? Number(payment.amount.toString()) : 0,
        })) as IRecurringExpensePaymentResponse[];
      },
      providesTags: ['RecurringExpensePayment'],
    }),

    // Get a specific payment
    getRecurringExpensePayment: builder.query<
      IRecurringExpensePaymentResponse,
      string
    >({
      query: (id) => `recurring-expense-payments/${id}`,
      transformResponse: (response: { data: IBackendRecurringExpensePaymentResponse }) => {
        const payment = response.data;
        return {
          ...payment,
          amount: payment.amount ? Number(payment.amount.toString()) : 0,
        } as IRecurringExpensePaymentResponse;
      },
      providesTags: (_result, _error, id) => [
        { type: 'RecurringExpensePayment', id },
      ],
    }),

    // Update a payment
    updateRecurringExpensePayment: builder.mutation<
      IRecurringExpensePaymentResponse,
      { id: string; data: IUpdateRecurringExpensePaymentRequest }
    >({
      query: ({ id, data }) => ({
        url: `recurring-expense-payments/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: { data: IBackendRecurringExpensePaymentResponse }) => {
        const payment = response.data;
        return {
          ...payment,
          amount: payment.amount ? Number(payment.amount.toString()) : 0,
        } as IRecurringExpensePaymentResponse;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'RecurringExpensePayment', id },
        'RecurringExpensePayment',
      ],
    }),

    // Delete a payment
    deleteRecurringExpensePayment: builder.mutation<void, string>({
      query: (id) => ({
        url: `recurring-expense-payments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'RecurringExpensePayment', id },
        'RecurringExpensePayment',
      ],
    }),
  }),
});

export const {
  useCreateRecurringExpensePaymentMutation,
  useGetRecurringExpensePaymentsQuery,
  useGetPaymentsByRecurringExpenseQuery,
  useGetPaymentsByRecurringExpensesQuery,
  useGetRecurringExpensePaymentQuery,
  useUpdateRecurringExpensePaymentMutation,
  useDeleteRecurringExpensePaymentMutation,
} = recurringExpensePaymentService;
