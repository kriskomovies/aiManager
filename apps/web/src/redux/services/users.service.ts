import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithOnQueryStarted } from '@/lib/api.utils';
import {
  IUserResponse,
  IUserListItem,
  ICreateUserRequest,
  IUpdateUserRequest,
  IUserQueryParams,
  IUserRoleResponse,
  IChangePasswordRequest,
  IPaginatedResponse,
  IBackendPaginatedResponse,
  IBackendApiResponse,
  IBackendUserData,
  UserStatus,
} from '@repo/interfaces';

// Transform backend response to frontend format (following buildings pattern)
const transformPaginatedResponse = <T>(
  response: IBackendPaginatedResponse<T>
): IPaginatedResponse<T> => ({
  items: response.data.data,
  meta: {
    page: response.data.page,
    pageSize: response.data.limit,
    pageCount: response.data.totalPages,
    total: response.data.total,
  },
});

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: baseQueryWithOnQueryStarted,
  tagTypes: ['User', 'UserRole'],
  endpoints: builder => ({
    getUsers: builder.query<
      IPaginatedResponse<IUserListItem>,
      IUserQueryParams
    >({
      query: params => {
        // Remove undefined values
        const cleanParams = Object.fromEntries(
          Object.entries(params).filter(([, value]) => value !== undefined)
        );

        return {
          url: 'users',
          params: cleanParams,
        };
      },
      transformResponse: (
        response: IBackendPaginatedResponse<IBackendUserData>
      ) => {
        const transformed = transformPaginatedResponse(response);

        // Transform each user to match IUserListItem
        const users: IUserListItem[] = transformed.items.map(
          (user: IBackendUserData) => ({
            id: user.id,
            email: user.email,
            name: user.name,
            surname: user.surname,
            phone: user.phone,
            status: user.status as UserStatus, // Backend returns string, frontend expects enum
            isUsingMobileApp: user.isUsingMobileApp,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            roleName: user.role?.name || 'unknown',
            roleDisplayName: user.role?.name || 'Unknown Role',
            isResident: user.residentId ? true : false,
            apartmentNumber: user.resident?.apartment?.number,
            buildingName: user.resident?.apartment?.building?.name,
            fullName: `${user.name} ${user.surname}`,
          })
        );

        return {
          ...transformed,
          items: users,
        };
      },
      providesTags: ['User'],
    }),

    getUser: builder.query<IUserResponse, string>({
      query: id => `users/${id}`,
      transformResponse: (response: IBackendApiResponse<IBackendUserData>) => {
        const user = response.data;
        return {
          ...user,
          status: user.status as UserStatus,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLoginAt: user.lastLoginAt,
          fullName: `${user.name} ${user.surname}`,
          isResident: user.residentId ? true : false,
        } as IUserResponse;
      },
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    getUserRoles: builder.query<IUserRoleResponse[], void>({
      query: () => 'users/roles',
      transformResponse: (response: IBackendApiResponse<IUserRoleResponse[]>) =>
        response.data,
      providesTags: ['UserRole'],
    }),

    getUsersByBuilding: builder.query<IUserResponse[], string>({
      query: buildingId => `users/buildings/${buildingId}`,
      transformResponse: (
        response: IBackendApiResponse<IBackendUserData[]>
      ) => {
        return response.data.map(
          (user: IBackendUserData) =>
            ({
              ...user,
              fullName: `${user.name} ${user.surname}`,
              isResident: user.residentId ? true : false,
            }) as IUserResponse
        );
      },
      providesTags: (_result, _error, buildingId) => [
        { type: 'User', id: `building-${buildingId}` },
      ],
    }),

    createUser: builder.mutation<IUserResponse, ICreateUserRequest>({
      query: user => ({
        url: 'users',
        method: 'POST',
        body: user,
      }),
      transformResponse: (response: IBackendApiResponse<IBackendUserData>) => {
        const user = response.data;
        return {
          ...user,
          fullName: `${user.name} ${user.surname}`,
          isResident: user.residentId ? true : false,
        } as IUserResponse;
      },
      invalidatesTags: ['User'],
    }),

    updateUser: builder.mutation<
      IUserResponse,
      { id: string; data: IUpdateUserRequest }
    >({
      query: ({ id, data }) => ({
        url: `users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: IBackendApiResponse<IBackendUserData>) => {
        const user = response.data;
        return {
          ...user,
          fullName: `${user.name} ${user.surname}`,
          isResident: user.residentId ? true : false,
        } as IUserResponse;
      },
      invalidatesTags: (_result, _error, { id }) => [
        'User',
        { type: 'User', id },
      ],
    }),

    changeUserPassword: builder.mutation<
      void,
      { id: string; data: IChangePasswordRequest }
    >({
      query: ({ id, data }) => ({
        url: `users/${id}/password`,
        method: 'PATCH',
        body: data,
      }),
    }),

    deleteUser: builder.mutation<void, string>({
      query: id => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => ['User', { type: 'User', id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useGetUserRolesQuery,
  useGetUsersByBuildingQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useChangeUserPasswordMutation,
  useDeleteUserMutation,
} = usersApi;
