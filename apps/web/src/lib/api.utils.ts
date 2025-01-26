import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include',
  prepareHeaders: headers => {
    // Add any custom headers here
    return headers;
  },
});

export const baseQueryWithOnQueryStarted: BaseQueryFn = async (
  args,
  api,
  extraOptions
) => {
  try {
    const result = await baseQuery(args, api, extraOptions);
    return result;
  } catch (error) {
    console.error('Error during baseQuery execution:', error);
    return { error };
  }
};
