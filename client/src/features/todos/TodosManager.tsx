import { TodoForm } from './TodoForm';
import { TodoList } from './TodoList';
import './TodosManager.css';

export const TodosManager = () => {
  return (
    <main>
      {/* Form */}
      <TodoForm />
      {/* List or no todos view */}
      <div className="todo-list-wrapper">
        <TodoList />
      </div>
    </main>
  );
};

export default TodosManager;
