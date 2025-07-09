import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithOnQueryStarted } from '@/lib/api.utils';
import {
  IApartmentResponse,
  ICreateApartmentRequest,
  IUpdateApartmentRequest,
  IApartmentQueryParams,
  IApartmentStats,
  ApartmentStatus,
  IPaginatedResponse,
} from '@repo/interfaces';

export const apartmentService = createApi({
  reducerPath: 'apartmentService',
  baseQuery: baseQueryWithOnQueryStarted,
  tagTypes: ['Apartment', 'ApartmentStats'],
  endpoints: (builder) => ({
    // Get all apartments with filtering and pagination
    getApartments: builder.query<IPaginatedResponse<IApartmentResponse>, IApartmentQueryParams>({
      query: (params) => ({
        url: 'apartments',
        params,
      }),
      providesTags: ['Apartment'],
    }),

    // Get apartment by ID
    getApartmentById: builder.query<IApartmentResponse, string>({
      query: (id) => `apartments/${id}`,
      transformResponse: (response: { data: IApartmentResponse; statusCode: number; timestamp: string }) => {
        return response.data;
      },
      providesTags: (_result, _error, id) => [{ type: 'Apartment', id }],
    }),

    // Get apartments by building ID
    getApartmentsByBuilding: builder.query<IApartmentResponse[], string>({
      query: (buildingId) => `apartments/building/${buildingId}`,
      transformResponse: (response: { data: IApartmentResponse[]; statusCode: number; timestamp: string }) => {
        return response.data;
      },
      providesTags: (_result, _error, buildingId) => [
        { type: 'Apartment', id: `building-${buildingId}` },
      ],
    }),

    // Create apartment
    createApartment: builder.mutation<IApartmentResponse, ICreateApartmentRequest>({
      query: (apartment) => ({
        url: 'apartments',
        method: 'POST',
        body: apartment,
      }),
      transformResponse: (response: { data: IApartmentResponse; statusCode: number; timestamp: string }) => {
        return response.data;
      },
      invalidatesTags: ['Apartment', 'ApartmentStats'],
    }),

    // Update apartment
    updateApartment: builder.mutation<IApartmentResponse, { id: string; updates: IUpdateApartmentRequest }>({
      query: ({ id, updates }) => ({
        url: `apartments/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      transformResponse: (response: { data: IApartmentResponse; statusCode: number; timestamp: string }) => {
        return response.data;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Apartment', id },
        'Apartment',
        'ApartmentStats',
      ],
    }),

    // Delete apartment
    deleteApartment: builder.mutation<void, string>({
      query: (id) => ({
        url: `apartments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Apartment', id },
        'Apartment',
        'ApartmentStats',
      ],
    }),

    // Get apartment statistics
    getApartmentStats: builder.query<IApartmentStats, string | undefined>({
      query: (buildingId) => ({
        url: 'apartments/stats',
        params: buildingId ? { buildingId } : undefined,
      }),
      transformResponse: (response: { data: IApartmentStats; statusCode: number; timestamp: string }) => {
        return response.data;
      },
      providesTags: ['ApartmentStats'],
    }),

    // Update apartment status
    updateApartmentStatus: builder.mutation<IApartmentResponse, { id: string; status: ApartmentStatus }>({
      query: ({ id, status }) => ({
        url: `apartments/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      transformResponse: (response: { data: IApartmentResponse; statusCode: number; timestamp: string }) => {
        return response.data;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Apartment', id },
        'Apartment',
        'ApartmentStats',
      ],
    }),

    // Add debt to apartment
    addDebt: builder.mutation<IApartmentResponse, { id: string; amount: number }>({
      query: ({ id, amount }) => ({
        url: `apartments/${id}/debt/add`,
        method: 'POST',
        body: { amount },
      }),
      transformResponse: (response: { data: IApartmentResponse; statusCode: number; timestamp: string }) => {
        return response.data;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Apartment', id },
        'Apartment',
        'ApartmentStats',
      ],
    }),

    // Pay debt for apartment
    payDebt: builder.mutation<IApartmentResponse, { id: string; amount: number }>({
      query: ({ id, amount }) => ({
        url: `apartments/${id}/debt/pay`,
        method: 'POST',
        body: { amount },
      }),
      transformResponse: (response: { data: IApartmentResponse; statusCode: number; timestamp: string }) => {
        return response.data;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Apartment', id },
        'Apartment',
        'ApartmentStats',
      ],
    }),
  }),
});

export const {
  useGetApartmentsQuery,
  useGetApartmentByIdQuery,
  useGetApartmentsByBuildingQuery,
  useCreateApartmentMutation,
  useUpdateApartmentMutation,
  useDeleteApartmentMutation,
  useGetApartmentStatsQuery,
  useUpdateApartmentStatusMutation,
  useAddDebtMutation,
  usePayDebtMutation,
} = apartmentService; 