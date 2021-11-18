import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface User {
  name: string;
  email: string;
  avatar: string;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
} as { user: null | User; isAuthenticated: boolean; isLoading: boolean };

export const login = createAsyncThunk<User>('user/login', async () => {
  const res = await fetch('/api/auth/me');

  if (!res.ok) {
    throw new Error('Not logged in');
  }

  if (
    res.headers.get('Content-Type')?.toLowerCase().includes('application/json')
  ) {
    return await res.json();
  } else {
    throw new Error('Not logged in');
  }
});

export const logout = createAsyncThunk('user/logout', async () => {
  await fetch('/api/auth/logout');
  return null;
});

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export default slice.reducer;

export const selectIsAuthenticated: (state: RootState) => boolean = (state) =>
  state.auth.isAuthenticated;

export const selectIsLogginIn: (state: RootState) => boolean = (state) =>
  state.auth.isLoading;

export const selectUser: (state: RootState) => User | null = (state) =>
  state.auth.user;
