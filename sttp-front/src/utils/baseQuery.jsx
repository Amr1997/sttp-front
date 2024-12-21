import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout, loginSuccess } from '../slices/authSlice';

const baseQueryWithReauth = (baseUrl) => {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const auth = getState()?.auth; // Safely access auth state
      const token = auth?.accessToken; // Safely access accessToken

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  return async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      const refreshToken = api.getState()?.auth?.refreshToken; // Safely access refreshToken
      if (refreshToken) {
        const refreshResult = await baseQuery(
          {
            url: 'jwt/refresh/',
            method: 'POST',
            body: { refresh: refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const { access } = refreshResult.data;
          api.dispatch(
            loginSuccess({
              accessToken: access,
              refreshToken,
              user: api.getState().auth.user,
            })
          );

          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } else {
        api.dispatch(logout());
      }
    }

    return result;
  };
};

export default baseQueryWithReauth;
