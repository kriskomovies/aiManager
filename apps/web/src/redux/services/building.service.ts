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

// API Response structure from backend
interface BackendPaginatedResponse<T> {
  data: {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  statusCode: number;
  timestamp: string;
}

// Transform backend response to frontend format
const transformPaginatedResponse = <T>(response: BackendPaginatedResponse<T>): IPaginatedResponse<T> => ({
  items: response.data.data,
  meta: {
    page: response.data.page,
    pageSize: response.data.limit,
    pageCount: response.data.totalPages,
    total: response.data.total,
  },
});

export const buildingApi = createApi({
  reducerPath: 'buildingApi',
  baseQuery: baseQueryWithOnQueryStarted,
  tagTypes: ['Building'],
  endpoints: (builder) => ({
    getBuildings: builder.query<IPaginatedResponse<IBuildingListItem>, IBuildingQueryParams>({
      query: (params) => {
        // Transform frontend params to backend params
        const backendParams: any = {
          page: params.page,
          limit: params.pageSize, // Backend expects 'limit' not 'pageSize'
          search: params.search,
          type: params.type,
          status: params.status,
        };
        
        // Transform sort parameter
        if (params.sort) {
          const [field, direction] = params.sort.split(':');
          backendParams.sortBy = field;
          backendParams.sortOrder = direction?.toUpperCase() || 'DESC';
        }
        
        // Remove undefined values
        Object.keys(backendParams).forEach(key => 
          backendParams[key] === undefined && delete backendParams[key]
        );
        
        return {
          url: 'buildings',
          params: backendParams,
        };
      },
      transformResponse: (response: BackendPaginatedResponse<any>) => {
        const transformed = transformPaginatedResponse(response);
        
        // Transform each building to match IBuildingListItem
        const buildings: IBuildingListItem[] = transformed.items.map((building: any) => ({
          id: building.id,
          name: building.name,
          address: `${building.street} ${building.number}${building.entrance ? `, Entrance ${building.entrance}` : ''}, ${building.district}, ${building.city} ${building.postalCode}`,
          type: building.type,
          apartmentCount: building.totalUnits || building.apartmentCount || 0,
          balance: parseFloat(building.balance || '0'),
          monthlyFee: parseFloat(building.monthlyFee || '0'),
          debt: parseFloat(building.debt || '0'),
          irregularities: building.irregularities || 0,
          status: building.status,
          createdAt: building.createdAt,
        }));
        
        return {
          ...transformed,
          items: buildings,
        };
      },
      providesTags: ['Building'],
    }),
    getBuilding: builder.query<IBuildingResponse, string>({
      query: (id) => `buildings/${id}`,
      transformResponse: (response: { data: any; statusCode: number; timestamp: string }) => {
        const building = response.data;
        return {
          ...building,
          address: `${building.street} ${building.number}${building.entrance ? `, Entrance ${building.entrance}` : ''}, ${building.district}, ${building.city} ${building.postalCode}`,
          balance: parseFloat(building.balance || '0'),
          monthlyFee: parseFloat(building.monthlyFee || '0'),
          debt: parseFloat(building.debt || '0'),
          apartmentCount: building.totalUnits || building.apartmentCount || 0,
          irregularities: building.irregularities || 0,
        };
      },
      providesTags: ['Building'],
    }),
    createBuilding: builder.mutation<IBuildingResponse, ICreateBuildingRequest>({
      query: (building) => ({
        url: 'buildings',
        method: 'POST',
        body: building,
      }),
      transformResponse: (response: { data: any; statusCode: number; timestamp: string }) => {
        const building = response.data;
        return {
          ...building,
          address: `${building.street} ${building.number}${building.entrance ? `, Entrance ${building.entrance}` : ''}, ${building.district}, ${building.city} ${building.postalCode}`,
          balance: parseFloat(building.balance || '0'),
          monthlyFee: parseFloat(building.monthlyFee || '0'),
          debt: parseFloat(building.debt || '0'),
          apartmentCount: building.totalUnits || building.apartmentCount || 0,
          irregularities: building.irregularities || 0,
        };
      },
      invalidatesTags: ['Building'],
    }),
    updateBuilding: builder.mutation<IBuildingResponse, { id: string; data: IUpdateBuildingRequest }>({
      query: ({ id, data }) => ({
        url: `buildings/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: { data: any; statusCode: number; timestamp: string }) => {
        const building = response.data;
        return {
          ...building,
          address: `${building.street} ${building.number}${building.entrance ? `, Entrance ${building.entrance}` : ''}, ${building.district}, ${building.city} ${building.postalCode}`,
          balance: parseFloat(building.balance || '0'),
          monthlyFee: parseFloat(building.monthlyFee || '0'),
          debt: parseFloat(building.debt || '0'),
          apartmentCount: building.totalUnits || building.apartmentCount || 0,
          irregularities: building.irregularities || 0,
        };
      },
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