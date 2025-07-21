import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithOnQueryStarted } from '@/lib/api.utils';
import {
  IOneTimeExpense,
  ICreateOneTimeExpenseRequest,
  IUpdateOneTimeExpenseRequest,
} from '@repo/interfaces';

export const expenseService = createApi({
  reducerPath: 'expenseService',
  baseQuery: baseQueryWithOnQueryStarted,
  tagTypes: ['OneTimeExpenses'],
  endpoints: builder => ({
    // Get all one-time expenses
    getOneTimeExpenses: builder.query<IOneTimeExpense[], void>({
      query: () => 'one-time-expenses',
      transformResponse: (response: { data: IOneTimeExpense[] }) => response.data,
      providesTags: ['OneTimeExpenses'],
    }),

    // Get one-time expense by ID
    getOneTimeExpenseById: builder.query<IOneTimeExpense, string>({
      query: id => `one-time-expenses/${id}`,
      transformResponse: (response: { data: IOneTimeExpense }) => response.data,
      providesTags: (_result, _error, id) => [
        { type: 'OneTimeExpenses' as const, id },
      ],
    }),

    // Create one-time expense
    createOneTimeExpense: builder.mutation<
      IOneTimeExpense,
      ICreateOneTimeExpenseRequest
    >({
      query: body => ({ url: 'one-time-expenses', method: 'POST', body }),
      transformResponse: (response: { data: IOneTimeExpense }) => response.data,
      invalidatesTags: ['OneTimeExpenses'],
    }),

    // Update one-time expense
    updateOneTimeExpense: builder.mutation<
      IOneTimeExpense,
      { id: string; data: IUpdateOneTimeExpenseRequest }
    >({
      query: ({ id, data }) => ({
        url: `one-time-expenses/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: { data: IOneTimeExpense }) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'OneTimeExpenses' as const, id },
      ],
    }),

    // Delete one-time expense
    deleteOneTimeExpense: builder.mutation<void, string>({
      query: id => ({ url: `one-time-expenses/${id}`, method: 'DELETE' }),
      invalidatesTags: ['OneTimeExpenses'],
    }),
  }),
});

export const {
  useGetOneTimeExpensesQuery,
  useGetOneTimeExpenseByIdQuery,
  useCreateOneTimeExpenseMutation,
  useUpdateOneTimeExpenseMutation,
  useDeleteOneTimeExpenseMutation,
} = expenseService; 