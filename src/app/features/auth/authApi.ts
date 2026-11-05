import { apiSlice } from '../api/apiSlice';
import {
  AuthResponseLogin,
  AuthResponseRegister,
} from '../../../types/auth_Types.ts';





export const authApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<AuthResponseLogin, { email: string; password: string }>({
      query: body => ({ url: '/auth/login', method: 'POST', body }),
    }),
    signup: builder.mutation<
      AuthResponseRegister,
      { name: string; email: string; password: string }
    >({
      query: body => ({ url: '/reg/new', method: 'POST', body }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useLogoutMutation } =
  authApi;
