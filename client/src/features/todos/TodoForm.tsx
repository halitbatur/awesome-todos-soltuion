import { useState } from 'react';
import { Todo, useAddTodoMutation } from '../../app/services/todos';
import { useAppDispatch, useTypedSelector } from '../../app/store';
import { selectIsAuthenticated } from '../auth/authSlice';
import { addLocalTodo } from './todosLocalSlice';

export const TodoForm: React.FC<any> = () => {
  const isAuthenticated = useTypedSelector(selectIsAuthenticated);

  const initialValue = { text: '', done: false, isLocal: !isAuthenticated };
  const [todo, setTodo] = useState<Omit<Todo, 'id'>>(initialValue);
  const [addTodo, { isLoading }] = useAddTodoMutation();

  const dispatch = useAppDispatch();

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setTodo((prev) => ({
      ...prev,
      [target.name]: target.value,
      isLocal: !isAuthenticated,
    }));
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      dispatch(addLocalTodo(todo)).then(() => setTodo(initialValue));
    } else {
      addTodo(todo).then(() => setTodo(initialValue));
    }
  };

  return (
    <div className="row">
      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          name="text"
          placeholder="What do you want to do next?"
          value={todo.text}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Todo'}
        </button>
      </form>
    </div>
  );
};
