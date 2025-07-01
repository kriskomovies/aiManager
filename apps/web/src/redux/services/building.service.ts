import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithOnQueryStarted } from '@/lib/api.utils';
import { 
  IBuildingResponse, 
  IBuildingListItem,
  ICreateBuildingRequest,
  IUpdateBuildingRequest,
  IBuildingQueryParams,
  IPaginatedResponse 
} from '@repo/interfaces';

export const buildingApi = createApi({
  reducerPath: 'buildingApi',
  baseQuery: baseQueryWithOnQueryStarted,
  tagTypes: ['Building'],
  endpoints: (builder) => ({
    getBuildings: builder.query<IPaginatedResponse<IBuildingListItem>, IBuildingQueryParams>({
      query: (params) => ({
        url: 'buildings',
        params,
      }),
      providesTags: ['Building'],
    }),
    getBuilding: builder.query<IBuildingResponse, string>({
      query: (id) => `buildings/${id}`,
      providesTags: ['Building'],
    }),
    createBuilding: builder.mutation<IBuildingResponse, ICreateBuildingRequest>({
      query: (building) => ({
        url: 'buildings',
        method: 'POST',
        body: building,
      }),
      invalidatesTags: ['Building'],
    }),
    updateBuilding: builder.mutation<IBuildingResponse, { id: string; data: IUpdateBuildingRequest }>({
      query: ({ id, data }) => ({
        url: `buildings/${id}`,
        method: 'PATCH',
        body: data,
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