import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../../types/auth_Types.ts';
// import type { User } from './authApi';

interface AuthState {
  token: string | null;
  user: User | null;
  hydrated: boolean;
}

const initialState: AuthState = { token: null, user: null, hydrated: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    clearCredentials: state => {
      state.token = null;
      state.user = null;
    },
    setHydrated: (state, action: PayloadAction<boolean>) => {
      state.hydrated = action.payload;
    },
  },
});

export const { setCredentials, clearCredentials, setHydrated } =
  authSlice.actions;
export default authSlice.reducer;
