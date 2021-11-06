import { configureStore } from '@reduxjs/toolkit';
import todos from './todos';
import date from './date';
import user from './user';
import messages from './messages';

export const store = configureStore({
  reducer: {
    todos,
    date,
    user,
    messages,
  },
});
