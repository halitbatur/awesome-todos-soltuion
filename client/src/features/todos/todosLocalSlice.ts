import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';
import { Todo } from '../../app/services/todos';
import { RootState } from '../../app/store';

const saveLocalStorage = (todos: Todo[], key = 'todosLocal'): void => {
  if (localStorage) localStorage.setItem(key, JSON.stringify(todos));
};

const loadLocalStorage = (key = 'todosLocal'): Todo[] => {
  try {
    const todos = JSON.parse(localStorage.getItem(key) || '');
    return todos;
  } catch (err) {
    console.log(err);
    saveLocalStorage([]);
    return [];
  }
};

const initialState = loadLocalStorage();

export const addLocalTodo = createAsyncThunk(
  'todosLocal/add',
  async (todo: Omit<Todo, 'id'>) => {
    let item: Todo = { ...todo, id: nanoid(), isLocal: true };
    const todos = loadLocalStorage();
    todos.push(item);
    saveLocalStorage(todos);

    return item;
  }
);

export const checkLocalTodo = createAsyncThunk(
  'todosLocal/check',
  async (todo: Pick<Todo, 'id'>) => {
    const todos = loadLocalStorage();
    const idx = todos.findIndex((t) => t.id === todo.id);
    todos[idx].done = true;
    saveLocalStorage(todos);

    return todo;
  }
);

export const deleteLocalTodo = createAsyncThunk(
  'todosLocal/delete',
  async (todo: Pick<Todo, 'id'>) => {
    const todos = loadLocalStorage();
    saveLocalStorage(todos.filter((t) => t.id !== todo.id));

    return todo;
  }
);

const slice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addLocalTodo.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(checkLocalTodo.fulfilled, (state, action) => {
        const idx = state.findIndex((t) => t.id === action.payload.id);
        state[idx].done = true;
      })
      .addCase(deleteLocalTodo.fulfilled, (state, action) =>
        state.filter((t) => t.id !== action.payload.id)
      );
  },
});

export default slice.reducer;

export const selectTodos = (state: RootState) => state.todos;
