import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

const initialState = [];

export const slice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    add: (state, action) => {
      state.push({ ...action.payload, id: nanoid() });
    },
    remove: (state, action) => {
      state = state.filter((msg) => msg.id === action.payload.id);
    },
    pop: (state) => state.slice(1),
  },
});

export const { add, remove, pop } = slice.actions;

export default slice.reducer;
