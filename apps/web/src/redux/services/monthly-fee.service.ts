import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithOnQueryStarted } from '@/lib/api.utils';
import {
  ICreateMonthlyFeeRequest,
  IMonthlyFeeResponse,
  IBackendMonthlyFeeResponse,
  IBackendMonthlyFeeApartment,
  IBuildingApartmentFeesResponse,
} from '@repo/interfaces';

export const monthlyFeeService = createApi({
  reducerPath: 'monthlyFeeService',
  baseQuery: baseQueryWithOnQueryStarted,
  tagTypes: ['MonthlyFee'],
  endpoints: builder => ({
    createMonthlyFee: builder.mutation<
      IMonthlyFeeResponse,
      ICreateMonthlyFeeRequest
    >({
      query: data => ({
        url: 'monthly-fees',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MonthlyFee'],
    }),
    getMonthlyFees: builder.query<IMonthlyFeeResponse[], void>({
      query: () => 'monthly-fees',
      transformResponse: (
        response:
          | IBackendMonthlyFeeResponse[]
          | { data: IBackendMonthlyFeeResponse[] }
      ) => {
        // Handle both direct array response and wrapped response
        const data = Array.isArray(response) ? response : response.data || [];

        // Transform string values to numbers
        return data.map(
          (fee: IBackendMonthlyFeeResponse): IMonthlyFeeResponse => ({
            ...fee,
            baseAmount: parseFloat(fee.baseAmount.toString()),
            apartments:
              fee.apartments?.map((apt: IBackendMonthlyFeeApartment) => ({
                ...apt,
                coefficient: parseFloat(apt.coefficient.toString()),
                amount: parseFloat(apt.calculatedAmount.toString()),
              })) || [],
          })
        );
      },
      providesTags: ['MonthlyFee'],
    }),
    getMonthlyFeesByBuilding: builder.query<IMonthlyFeeResponse[], string>({
      query: buildingId => `monthly-fees/building/${buildingId}`,
      transformResponse: (
        response:
          | IBackendMonthlyFeeResponse[]
          | { data: IBackendMonthlyFeeResponse[] }
      ) => {
        // Handle both direct array response and wrapped response
        const data = Array.isArray(response) ? response : response.data || [];

        // Transform string values to numbers
        return data.map(
          (fee: IBackendMonthlyFeeResponse): IMonthlyFeeResponse => ({
            ...fee,
            baseAmount: parseFloat(fee.baseAmount.toString()),
            apartments:
              fee.apartments?.map((apt: IBackendMonthlyFeeApartment) => ({
                ...apt,
                coefficient: parseFloat(apt.coefficient.toString()),
                amount: parseFloat(apt.calculatedAmount.toString()),
              })) || [],
          })
        );
      },
      providesTags: (_, __, buildingId) => [
        { type: 'MonthlyFee', id: `building-${buildingId}` },
      ],
    }),
    getMonthlyFeeById: builder.query<IMonthlyFeeResponse, string>({
      query: id => `monthly-fees/${id}`,
      transformResponse: (response: { data: IBackendMonthlyFeeResponse } | IBackendMonthlyFeeResponse): IMonthlyFeeResponse => {
        // Handle both wrapped and direct responses
        const data = 'data' in response ? response.data : response;
        
        return {
          ...data,
          baseAmount: parseFloat((data.baseAmount || 0).toString()),
          apartments:
            data.apartments?.map((apt: IBackendMonthlyFeeApartment) => ({
              ...apt,
              coefficient: parseFloat((apt.coefficient || 1).toString()),
              amount: parseFloat((apt.calculatedAmount || 0).toString()),
            })) || [],
        };
      },
      providesTags: (_, __, id) => [{ type: 'MonthlyFee', id }],
    }),
    deleteMonthlyFee: builder.mutation<void, string>({
      query: id => ({
        url: `monthly-fees/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MonthlyFee'],
    }),
    getApartmentPaymentSummary: builder.query<unknown, string>({
      query: apartmentId => `monthly-fees/apartment/${apartmentId}/payments`,
      providesTags: (_, __, apartmentId) => [
        { type: 'MonthlyFee', id: `apartment-${apartmentId}` },
      ],
    }),
    getBuildingApartmentFees: builder.query<IBuildingApartmentFeesResponse[], string>({
      query: buildingId => `monthly-fees/building/${buildingId}/apartment-fees`,
      transformResponse: (response: { data: IBuildingApartmentFeesResponse[] }) => {
        // Handle wrapped response - extract the actual data array
        return response.data || [];
      },
      providesTags: (_, __, buildingId) => [
        { type: 'MonthlyFee', id: `building-fees-${buildingId}` },
      ],
    }),
  }),
});

export const {
  useCreateMonthlyFeeMutation,
  useGetMonthlyFeesQuery,
  useGetMonthlyFeesByBuildingQuery,
  useGetMonthlyFeeByIdQuery,
  useDeleteMonthlyFeeMutation,
  useGetApartmentPaymentSummaryQuery,
  useGetBuildingApartmentFeesQuery,
} = monthlyFeeService;
