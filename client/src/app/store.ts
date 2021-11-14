import {
  configureStore,
  ConfigureStoreOptions,
  nanoid,
} from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { todoApi } from './services/todos';
import auth from '../features/auth/authSlice';
import todos from '../features/todos/todosLocalSlice';
import {
  MiddlewareAPI,
  isRejectedWithValue,
  Middleware,
} from '@reduxjs/toolkit';
import { store as notificationsStore } from 'react-notifications-component';

/**
 * Log a warning and show a toast!
 */
const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these use matchers!
    if (isRejectedWithValue(action)) {
      console.warn('We got a rejected action!', action);
      let msg =
        action.payload?.data?.message ??
        action.payload?.error ??
        action.error?.message ??
        'An error occured.';

      notify(msg, 'danger', 'Error', 3000, true, true);
    }

    return next(action);
  };

export const createStore = (
  options?: ConfigureStoreOptions['preloadedState'] | undefined
) =>
  configureStore({
    reducer: {
      [todoApi.reducerPath]: todoApi.reducer,
      auth,
      todos,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(todoApi.middleware, rtkQueryErrorLogger),
    ...options,
  });

export const store = createStore();

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export const notify = (
  message: string,
  type:
    | 'success'
    | 'danger'
    | 'info'
    | 'default'
    | 'warning'
    | undefined = 'success',
  title: string = 'Success',
  timeout: number = 1500,
  onScreen: boolean = false,
  pauseOnHover: boolean = false
) => {
  notificationsStore.addNotification({
    id: nanoid(),
    title,
    message,
    type,
    insert: 'bottom',
    container: 'bottom-right',
    dismiss: {
      duration: timeout,
      onScreen,
      pauseOnHover,
    },
  });
};
