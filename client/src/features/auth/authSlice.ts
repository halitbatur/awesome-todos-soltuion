import { createSlice } from '@reduxjs/toolkit';
import { todoApi } from '../../app/services/todos';
import { RootState } from '../../app/store';

export interface User {
  firstname: string;
  lastname: string;
  email: string;
  profilePicture: string;
}

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
} as { user: null | User; token: string | null; isAuthenticated: boolean };

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(todoApi.endpoints.login.matchPending, (state, action) => {
        console.log('pending', action);
      })
      .addMatcher(todoApi.endpoints.login.matchFulfilled, (state, action) => {
        console.log('fulfilled', action);
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addMatcher(todoApi.endpoints.login.matchRejected, (state, action) => {
        console.log('rejected', action);
      });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export const selectUser = (state: RootState) => state.auth.user;
