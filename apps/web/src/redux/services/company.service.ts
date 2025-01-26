import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithOnQueryStarted } from '@/lib/api.utils'

export interface Company {
  id: string
  name: string
  address: string
  taxId: string
  createdAt: string
  updatedAt: string
}

export interface CreateCompanyDto {
  name: string
  address: string
  taxId: string
}

export const companyApi = createApi({
  reducerPath: 'companyApi',
  baseQuery: baseQueryWithOnQueryStarted,
  tagTypes: ['Company'],
  endpoints: (builder) => ({
    getCompanies: builder.query<Company[], void>({
      query: () => 'companies',
      providesTags: ['Company'],
    }),
    getCompany: builder.query<Company, string>({
      query: (id) => `companies/${id}`,
      providesTags: ['Company'],
    }),
    createCompany: builder.mutation<Company, CreateCompanyDto>({
      query: (company) => ({
        url: 'companies',
        method: 'POST',
        body: company,
      }),
      invalidatesTags: ['Company'],
    }),
    updateCompany: builder.mutation<Company, Partial<Company> & Pick<Company, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `companies/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Company'],
    }),
    deleteCompany: builder.mutation<void, string>({
      query: (id) => ({
        url: `companies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Company'],
    }),
  }),
})

export const {
  useGetCompaniesQuery,
  useGetCompanyQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companyApi 