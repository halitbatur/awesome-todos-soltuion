import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export interface Todo {
  id: string;
  done: boolean;
  text: string;
}

type TodosResponse = Todo[];

export interface User {
  firstname: string;
  lastname: string;
  email: string;
  profilePicture: string;
}

// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://5000-jade-panda-rdx4kbll.ws-eu18.gitpod.io/api/',
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authentication', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 3 });

const __TAG__ = 'Todo';
const __API_PATH__ = 'todos';

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
    getTodos: build.query<TodosResponse, void>({
      query: () => ({ url: __API_PATH__ }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: `${__TAG__}` as const, id })),
              __TAG__,
            ]
          : [__TAG__],
    }),
    addTodo: build.mutation<Todo, Omit<Todo, 'id'>>({
      query: (body) => ({
        url: __API_PATH__,
        method: 'POST',
        body,
      }),
      invalidatesTags: [__TAG__],
    }),
    getTodo: build.query<Todo, string>({
      query: (id) => `${__API_PATH__}/${id}`,
      providesTags: [__TAG__],
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
      invalidatesTags: [__TAG__],
    }),
    deleteTodo: build.mutation<{ success: boolean; id: string }, string>({
      query(id) {
        return {
          url: `${__API_PATH__}/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: [__TAG__],
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
