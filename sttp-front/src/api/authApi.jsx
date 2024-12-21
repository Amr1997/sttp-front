import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from '../utils/baseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth('http://localhost:8000/auth/'),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'jwt/create/',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: 'users/',
        method: 'POST',
        body: data,
      }),
    }),
    refresh: builder.mutation({
      query: (token) => ({
        url: 'jwt/refresh/',
        method: 'POST',
        body: { refresh: token },
      }),
    }),
    verify: builder.mutation({
      query: (token) => ({
        url: 'jwt/verify/',
        method: 'POST',
        body: { token },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useVerifyMutation,
} = authApi;
