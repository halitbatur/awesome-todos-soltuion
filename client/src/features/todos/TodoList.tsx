import {
  useGetTodosQuery,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
  Todo,
} from '../../app/services/todos';
import { TodoListItem } from './TodoListItem';
import CircleLoader from 'react-spinners/CircleLoader';
import { notify, useAppDispatch, useTypedSelector } from '../../app/store';
import {
  checkLocalTodo,
  deleteLocalTodo,
  selectTodos,
} from './todosLocalSlice';
import { selectIsAuthenticated } from '../auth/authSlice';

export const TodoList = () => {
  const isAuthenticated = useTypedSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();
  const {
    data: todosRemote,
    isLoading,
    isError,
    isUninitialized,
  } = useGetTodosQuery(undefined, { skip: isAuthenticated });

  const todosLocal = useTypedSelector(selectTodos);

  const [deleteTodo, { isLoading: isDeleting, originalArgs: deletedId }] =
    useDeleteTodoMutation();
  const [updateTodo, { isLoading: isUpdating, originalArgs: updatedId }] =
    useUpdateTodoMutation();

  const completeTodo = (id: string, done: boolean) => {
    const onDone = () => {
      notify('Todo updated', 'info');
    };
    if (!isUninitialized) {
      dispatch(checkLocalTodo({ id })).then(onDone);
    } else updateTodo({ id, done }).then(onDone);
  };

  let todos: Todo[];
  if (isAuthenticated) {
    todos = todosRemote ?? [];
  } else {
    todos = todosLocal;
  }

  const doneTodos = todos.filter((t) => t.done);
  const undoneTodos = todos.filter((t) => !t.done);

  const removeTodo = (id: string) => {
    const onDone = () => {
      notify('Todo Deleted');
    };
    if (!isAuthenticated) {
      dispatch(deleteLocalTodo({ id })).then(onDone);
    } else deleteTodo(id).then();
  };

  if (isLoading && !isError) {
    return (
      <div className="todos-loader">
        <CircleLoader color={'#3178c6'} />
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div style={{ textAlign: 'center' }}>No todos! Start by adding some</div>
    );
  }

  const renderTodoItem = (todo: Todo) => (
    <TodoListItem
      key={todo.id}
      data={todo}
      onDelete={removeTodo}
      onDone={completeTodo}
      isDeleting={isDeleting && deletedId === todo.id}
      isUpdating={isUpdating && updatedId?.id === todo.id}
    />
  );

  return (
    <div>
      <ul className="todo-list">{undoneTodos.map(renderTodoItem)}</ul>
      {doneTodos.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h2>Completed</h2>
          <ul className="todo-list">{doneTodos.map(renderTodoItem)}</ul>
        </div>
      )}
    </div>
  );
};
