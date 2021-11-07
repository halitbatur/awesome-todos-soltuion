import React, { useState } from "react";
import {
  Todo,
  useAddTodoMutation,
  useGetTodosQuery,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "../../app/services/todos";
import "./TodosManager.css";
import CircleLoader from "react-spinners/CircleLoader";

const TodoForm: React.FC<any> = () => {
  const initialValue = { text: "", done: false };
  const [todo, setTodo] = useState<Omit<Todo, "id">>(initialValue);
  const [addTodo, { isLoading }] = useAddTodoMutation();

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setTodo((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo(todo).then(() => setTodo(initialValue));
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
          {isLoading ? "Adding..." : "Add Todo"}
        </button>
      </form>
    </div>
  );
};

const TodoListItem = ({
  data: { text, id, done },
  onDone,
  onDelete,
  isDeleting,
  isUpdating,
}: {
  data: Todo;
  onDone: (id: string, done: boolean) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  isUpdating: boolean;
}) => {
  const classes = ["todo-item", "flex"];
  done && classes.push("checked");

  return (
    <li className={classes.join(" ")}>
      <label className="todo-item-check-container">
        <input
          type="checkbox"
          checked={done}
          onChange={(e) => onDone(id, e.target.checked)}
        />
      </label>
      <div className="todo-item-meta-container">
        <h3 className="todo-title">{text}</h3>
        <div>
          <button className="todo-delete" onClick={() => onDelete(id)}>
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};

const TodoList = () => {
  const { data: todos, isLoading, isError } = useGetTodosQuery();
  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();

  const completeTodo = (id: string, done: boolean) => {
    updateTodo({ id, done });
  };

  if (isLoading && !isError) {
    return (
      <div className="todos-loader">
        <CircleLoader color={"#3178c6"} />
      </div>
    );
  }

  if (!todos) {
    return (
      <div style={{ textAlign: "center" }}>No todos! Start by adding some</div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoListItem
          key={todo.id}
          data={todo}
          onDelete={deleteTodo}
          onDone={completeTodo}
          isDeleting={isDeleting}
          isUpdating={isUpdating}
        />
      ))}
    </div>
  );
};

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
