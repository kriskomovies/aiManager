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
  IBackendApartmentResponse,
  IBackendApartmentApiResponse,
  IBackendApartmentStatsResponse,
  IBackendPaginatedResponse,
  IBackendApartmentQueryParams,
} from '@repo/interfaces';

// Transform backend response to frontend format
const transformPaginatedResponse = <T>(response: IBackendPaginatedResponse<T>): IPaginatedResponse<T> => ({
  items: response.data.data,
  meta: {
    page: response.data.page,
    pageSize: response.data.limit,
    pageCount: response.data.totalPages,
    total: response.data.total,
  },
});

export const apartmentService = createApi({
  reducerPath: 'apartmentService',
  baseQuery: baseQueryWithOnQueryStarted,
  tagTypes: ['Apartment', 'ApartmentStats'],
  endpoints: (builder) => ({
    // Get all apartments with filtering and pagination
    getApartments: builder.query<IPaginatedResponse<IApartmentResponse>, IApartmentQueryParams>({
      query: (params) => {
        // Transform frontend params to backend params
        const backendParams: IBackendApartmentQueryParams = {
          page: params.page,
          limit: params.pageSize,
          search: params.search,
          buildingId: params.buildingId,
          type: params.type,
          status: params.status,
          floor: params.floor,
          hasDebt: params.hasDebt,
          minQuadrature: params.minQuadrature,
          maxQuadrature: params.maxQuadrature,
        };

        // Transform sort parameter
        if (params.sort) {
          const [field, direction] = params.sort.split(':');
          backendParams.sortBy = field;
          backendParams.sortOrder = direction?.toUpperCase() as 'ASC' | 'DESC' || 'DESC';
        }

        // Remove undefined values
        Object.keys(backendParams).forEach(key =>
          backendParams[key as keyof IBackendApartmentQueryParams] === undefined && delete backendParams[key as keyof IBackendApartmentQueryParams]
        );

        return {
          url: 'apartments',
          params: backendParams,
        };
      },
      transformResponse: (response: IBackendPaginatedResponse<IBackendApartmentResponse>) => {
        const transformed = transformPaginatedResponse(response);
        
        // Transform each apartment
        const apartments: IApartmentResponse[] = (transformed.items as IBackendApartmentResponse[]).map((apartment: IBackendApartmentResponse) => ({
          ...apartment,
          quadrature: parseFloat(apartment.quadrature.toString()),
          commonParts: apartment.commonParts ? parseFloat(apartment.commonParts.toString()) : undefined,
          idealParts: apartment.idealParts ? parseFloat(apartment.idealParts.toString()) : undefined,
          monthlyRent: apartment.monthlyRent ? parseFloat(apartment.monthlyRent.toString()) : undefined,
          maintenanceFee: apartment.maintenanceFee ? parseFloat(apartment.maintenanceFee.toString()) : undefined,
          debt: apartment.debt ? parseFloat(apartment.debt.toString()) : undefined,
        }));
        
        return {
          ...transformed,
          items: apartments,
        };
      },
      providesTags: ['Apartment'],
    }),

    // Get apartment by ID
    getApartmentById: builder.query<IApartmentResponse, string>({
      query: (id) => `apartments/${id}`,
      transformResponse: (response: IBackendApartmentApiResponse<IBackendApartmentResponse>) => {
        const apartment = response.data;
        return {
          ...apartment,
          quadrature: parseFloat(apartment.quadrature.toString()),
          commonParts: apartment.commonParts ? parseFloat(apartment.commonParts.toString()) : undefined,
          idealParts: apartment.idealParts ? parseFloat(apartment.idealParts.toString()) : undefined,
          monthlyRent: apartment.monthlyRent ? parseFloat(apartment.monthlyRent.toString()) : undefined,
          maintenanceFee: apartment.maintenanceFee ? parseFloat(apartment.maintenanceFee.toString()) : undefined,
          debt: apartment.debt ? parseFloat(apartment.debt.toString()) : undefined,
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'Apartment', id }],
    }),

    // Get apartments by building ID
    getApartmentsByBuilding: builder.query<IApartmentResponse[], string>({
      query: (buildingId) => `apartments/building/${buildingId}`,
      transformResponse: (response: IBackendApartmentApiResponse<IBackendApartmentResponse[]>) => {
        return response.data.map((apartment: IBackendApartmentResponse) => ({
          ...apartment,
          quadrature: parseFloat(apartment.quadrature.toString()),
          commonParts: apartment.commonParts ? parseFloat(apartment.commonParts.toString()) : undefined,
          idealParts: apartment.idealParts ? parseFloat(apartment.idealParts.toString()) : undefined,
          monthlyRent: apartment.monthlyRent ? parseFloat(apartment.monthlyRent.toString()) : undefined,
          maintenanceFee: apartment.maintenanceFee ? parseFloat(apartment.maintenanceFee.toString()) : undefined,
          debt: apartment.debt ? parseFloat(apartment.debt.toString()) : undefined,
        }));
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
      transformResponse: (response: IBackendApartmentApiResponse<IBackendApartmentResponse>) => {
        const apartment = response.data;
        return {
          ...apartment,
          quadrature: parseFloat(apartment.quadrature.toString()),
          commonParts: apartment.commonParts ? parseFloat(apartment.commonParts.toString()) : undefined,
          idealParts: apartment.idealParts ? parseFloat(apartment.idealParts.toString()) : undefined,
          monthlyRent: apartment.monthlyRent ? parseFloat(apartment.monthlyRent.toString()) : undefined,
          maintenanceFee: apartment.maintenanceFee ? parseFloat(apartment.maintenanceFee.toString()) : undefined,
          debt: apartment.debt ? parseFloat(apartment.debt.toString()) : undefined,
        };
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
      transformResponse: (response: IBackendApartmentApiResponse<IBackendApartmentResponse>) => {
        const apartment = response.data;
        return {
          ...apartment,
          quadrature: parseFloat(apartment.quadrature.toString()),
          commonParts: apartment.commonParts ? parseFloat(apartment.commonParts.toString()) : undefined,
          idealParts: apartment.idealParts ? parseFloat(apartment.idealParts.toString()) : undefined,
          monthlyRent: apartment.monthlyRent ? parseFloat(apartment.monthlyRent.toString()) : undefined,
          maintenanceFee: apartment.maintenanceFee ? parseFloat(apartment.maintenanceFee.toString()) : undefined,
          debt: apartment.debt ? parseFloat(apartment.debt.toString()) : undefined,
        };
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
      transformResponse: (response: IBackendApartmentApiResponse<IBackendApartmentStatsResponse>) => {
        const stats = response.data;
        return {
          ...stats,
          totalDebt: parseFloat(stats.totalDebt.toString()),
          totalMonthlyRevenue: parseFloat(stats.totalMonthlyRevenue.toString()),
          averageQuadrature: parseFloat(stats.averageQuadrature.toString()),
          totalQuadrature: parseFloat(stats.totalQuadrature.toString()),
          averageRent: parseFloat(stats.averageRent.toString()),
        };
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
      transformResponse: (response: IBackendApartmentApiResponse<IBackendApartmentResponse>) => {
        const apartment = response.data;
        return {
          ...apartment,
          quadrature: parseFloat(apartment.quadrature.toString()),
          commonParts: apartment.commonParts ? parseFloat(apartment.commonParts.toString()) : undefined,
          idealParts: apartment.idealParts ? parseFloat(apartment.idealParts.toString()) : undefined,
          monthlyRent: apartment.monthlyRent ? parseFloat(apartment.monthlyRent.toString()) : undefined,
          maintenanceFee: apartment.maintenanceFee ? parseFloat(apartment.maintenanceFee.toString()) : undefined,
          debt: apartment.debt ? parseFloat(apartment.debt.toString()) : undefined,
        };
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
      transformResponse: (response: IBackendApartmentApiResponse<IBackendApartmentResponse>) => {
        const apartment = response.data;
        return {
          ...apartment,
          quadrature: parseFloat(apartment.quadrature.toString()),
          commonParts: apartment.commonParts ? parseFloat(apartment.commonParts.toString()) : undefined,
          idealParts: apartment.idealParts ? parseFloat(apartment.idealParts.toString()) : undefined,
          monthlyRent: apartment.monthlyRent ? parseFloat(apartment.monthlyRent.toString()) : undefined,
          maintenanceFee: apartment.maintenanceFee ? parseFloat(apartment.maintenanceFee.toString()) : undefined,
          debt: apartment.debt ? parseFloat(apartment.debt.toString()) : undefined,
        };
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
      transformResponse: (response: IBackendApartmentApiResponse<IBackendApartmentResponse>) => {
        const apartment = response.data;
        return {
          ...apartment,
          quadrature: parseFloat(apartment.quadrature.toString()),
          commonParts: apartment.commonParts ? parseFloat(apartment.commonParts.toString()) : undefined,
          idealParts: apartment.idealParts ? parseFloat(apartment.idealParts.toString()) : undefined,
          monthlyRent: apartment.monthlyRent ? parseFloat(apartment.monthlyRent.toString()) : undefined,
          maintenanceFee: apartment.maintenanceFee ? parseFloat(apartment.maintenanceFee.toString()) : undefined,
          debt: apartment.debt ? parseFloat(apartment.debt.toString()) : undefined,
        };
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