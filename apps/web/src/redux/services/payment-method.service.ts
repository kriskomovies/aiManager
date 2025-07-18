import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithOnQueryStarted } from '@/lib/api.utils';
import {
  IUserPaymentMethodResponse,
  ICreateUserPaymentMethodRequest,
  IUpdateUserPaymentMethodRequest,
  IPaginatedResponse,
} from '@repo/interfaces';

// Simple interface for active payment methods (used in dropdowns)
interface IActiveUserPaymentMethod {
  id: string;
  displayName: string;
  method: string;
  isDefault: boolean;
}

export const paymentMethodService = createApi({
  reducerPath: 'paymentMethodService',
  baseQuery: baseQueryWithOnQueryStarted,
  tagTypes: ['UserPaymentMethod'],
  endpoints: (builder) => ({
    // Get all active user payment methods (simplified for dropdowns)
    getActiveUserPaymentMethods: builder.query<IActiveUserPaymentMethod[], void>({
      query: () => 'user-payment-methods/active',
      transformResponse: (response: { data: IUserPaymentMethodResponse[] }) => {
        return response.data.map((method) => ({
          id: method.id,
          displayName: method.displayName,
          method: method.method,
          isDefault: method.isDefault,
        }));
      },
      providesTags: ['UserPaymentMethod'],
    }),

    // Get all user payment methods with pagination
    getUserPaymentMethods: builder.query<IPaginatedResponse<IUserPaymentMethodResponse>, any>({
      query: (params) => ({
        url: 'user-payment-methods',
        params,
      }),
      providesTags: ['UserPaymentMethod'],
    }),

    // Get user payment method by ID
    getUserPaymentMethodById: builder.query<IUserPaymentMethodResponse, string>({
      query: (id) => `user-payment-methods/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'UserPaymentMethod', id }],
    }),

    // Create user payment method
    createUserPaymentMethod: builder.mutation<IUserPaymentMethodResponse, ICreateUserPaymentMethodRequest>({
      query: (paymentMethod) => ({
        url: 'user-payment-methods',
        method: 'POST',
        body: paymentMethod,
      }),
      invalidatesTags: ['UserPaymentMethod'],
    }),

    // Update user payment method
    updateUserPaymentMethod: builder.mutation<IUserPaymentMethodResponse, { id: string; updates: IUpdateUserPaymentMethodRequest }>({
      query: ({ id, updates }) => ({
        url: `user-payment-methods/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'UserPaymentMethod', id },
        'UserPaymentMethod',
      ],
    }),

    // Delete user payment method
    deleteUserPaymentMethod: builder.mutation<void, string>({
      query: (id) => ({
        url: `user-payment-methods/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'UserPaymentMethod', id },
        'UserPaymentMethod',
      ],
    }),
  }),
});

export const {
  useGetActiveUserPaymentMethodsQuery,
  useGetUserPaymentMethodsQuery,
  useGetUserPaymentMethodByIdQuery,
  useCreateUserPaymentMethodMutation,
  useUpdateUserPaymentMethodMutation,
  useDeleteUserPaymentMethodMutation,
} = paymentMethodService; 