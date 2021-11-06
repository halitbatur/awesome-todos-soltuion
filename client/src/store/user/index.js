import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiLogin } from './api';

const initialState = {
  user: null,
  status: 'idle',
};

export const login = createAsyncThunk('user/login', async (creds) => {
  const response = await apiLogin(creds);
  // The value we return becomes the `fulfilled` action payload
  return response;
});

export const slice = createSlice({
  name: 'user',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload;
      });
  },
});

export default slice.reducer;
