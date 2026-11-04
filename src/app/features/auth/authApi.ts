import { apiSlice } from '../api/apiSlice';

export interface User {
  id: string;
  name: string;
  email: string;
}
export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: body => ({ url: '/auth/login', method: 'POST', body }),
    }),
    signup: builder.mutation<
      AuthResponse,
      { name: string; email: string; password: string }
    >({
      query: body => ({ url: '/auth/signup', method: 'POST', body }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useLogoutMutation } =
  authApi;
