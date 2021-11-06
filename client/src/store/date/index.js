import { createSlice } from '@reduxjs/toolkit';
import { format } from 'date-fns';

const nd = new Date();

const parse = (nd) => {
  return {
    date: nd,
    day: format(nd, 'dd'),
    dayDisplay: format(nd, 'd'),
    month: format(nd, 'MM'),
    monthDisplay: format(nd, 'MMM'),
    year: format(nd, 'y'),
    weekday: format(nd, 'EEEE'),
  };
};

const initialState = parse(nd);

export const slice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    reset: (state) => parse(new Date()),
  },
});

export const { reset } = slice.actions;

export default slice.reducer;
