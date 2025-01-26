import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithOnQueryStarted } from '@/lib/api.utils';
import type { Building, BuildingResponse, BuildingQueryParams } from '@/types/building';

export const buildingApi = createApi({
  reducerPath: 'buildingApi',
  baseQuery: baseQueryWithOnQueryStarted,
  tagTypes: ['Building'],
  endpoints: (builder) => ({
    getBuildings: builder.query<BuildingResponse, BuildingQueryParams>({
      query: (params) => ({
        url: 'buildings',
        params,
      }),
      providesTags: ['Building'],
    }),
    getBuilding: builder.query<Building, string>({
      query: (id) => `buildings/${id}`,
      providesTags: ['Building'],
    }),
    createBuilding: builder.mutation<Building, Partial<Building>>({
      query: (building) => ({
        url: 'buildings',
        method: 'POST',
        body: building,
      }),
      invalidatesTags: ['Building'],
    }),
    updateBuilding: builder.mutation<Building, Partial<Building> & Pick<Building, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `buildings/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Building'],
    }),
    deleteBuilding: builder.mutation<void, string>({
      query: (id) => ({
        url: `buildings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Building'],
    }),
  }),
});

export const {
  useGetBuildingsQuery,
  useGetBuildingQuery,
  useCreateBuildingMutation,
  useUpdateBuildingMutation,
  useDeleteBuildingMutation,
} = buildingApi; 