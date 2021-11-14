import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { User } from '../../features/auth/authSlice';
// import { RootState } from '../store';

export interface Todo {
  id: string;
  done: boolean;
  text: string;
  isLocal: boolean | void;
}

const baseUrl = '/api/';

// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
  baseUrl,
  // prepareHeaders: (headers, { getState }) => {
  //   // By default, if we have a token in the store, let's use that for authenticated requests
  //   const token = (getState() as RootState).auth.token;
  //   if (token) {
  //     headers.set('authentication', `Bearer ${token}`);
  //   }
  //   return headers;
  // },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 3 });

const __TAG__ = 'Todo';
const __API_PATH__ = 'todos';
export const __API_LOGIN_PATH__ = baseUrl + 'auth/google';

export const todoApi = createApi({
  reducerPath: 'todosApi', // We only specify this because there are many services. This would not be common in most applications
  baseQuery: baseQueryWithRetry,
  tagTypes: [__TAG__],
  endpoints: (build) => ({
    login: build.mutation<{ token: string; user: User }, any>({
      query: (credentials: any) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getTodos: build.query<Todo[], void>({
      query: () => ({ url: __API_PATH__ }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Todo' as const, id })),
              { type: __TAG__, id: 'LIST' },
            ]
          : [{ type: __TAG__, id: 'LIST' }],
    }),
    addTodo: build.mutation<Todo, Omit<Todo, 'id'>>({
      query: (body) => ({
        url: __API_PATH__,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: __TAG__, id: 'LIST' }],
    }),
    getTodo: build.query<Todo, string>({
      query: (id) => `${__API_PATH__}/${id}`,
      providesTags: (result, error, id) => [{ type: __TAG__, id }],
    }),
    updateTodo: build.mutation<Todo, Partial<Todo>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `${__API_PATH__}/${id}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: (result, error, arg) => [{ type: __TAG__, id: arg.id }],
    }),
    deleteTodo: build.mutation<{ success: boolean; id: string }, string>({
      query(id) {
        return {
          url: `${__API_PATH__}/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: (result, error, id) => [{ type: __TAG__, id }],
    }),
  }),
});

export const {
  useAddTodoMutation,
  useDeleteTodoMutation,
  useGetTodoQuery,
  useGetTodosQuery,
  useLoginMutation,
  useUpdateTodoMutation,
} = todoApi;

export const {
  endpoints: { login },
} = todoApi;
