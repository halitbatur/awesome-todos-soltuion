import { useTypedSelector } from '../../app/store';
import { selectIsLogginIn } from '../auth/authSlice';
import { TodoForm } from './TodoForm';
import { TodoList } from './TodoList';
import './TodosManager.css';

export const TodosManager = () => {
  const isLogginIn = useTypedSelector(selectIsLogginIn);
  return (
    <main>
      {/* Form */}
      <TodoForm />
      {/* List or no todos view */}
      <div className="todo-list-wrapper">
        {isLogginIn && <p>Loading</p>}
        {!isLogginIn && <TodoList />}
      </div>
    </main>
  );
};

export default TodosManager;
