import React from "react";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";

// Component

export default function Main({ todos, setTodos }) {
  // Helper function to handle the state
  const submitTodo = (todo) => {
    setTodos([...todos, todo]);
  };

  return (
    <main className="container">
      {/* Form */}
      <TodoForm submitTodo={submitTodo} />

      {/* List or no todos view */}
      <div>
        {todos.length > 0 && <TodosWrapper todos={todos} setTodos={setTodos} />}
        {todos.length <= 0 && <NoTodos />}
      </div>
    </main>
  );
}

// Component

function NoTodos() {
  return (
    <div>
      <span id="lucky">Lucky! No tasks yet!</span>
      <br />
      <span id="action">Start by adding things to do!</span>
    </div>
  );
}

// Component

function TodosWrapper({ todos, setTodos }) {
  // Helper functions
  // This function will be used
  // below inside the anonymous function
  const setChecked = (id, state) => {
    let arr = [...todos];
    arr[id].done = state;
    setTodos(arr);
  };

  // Helper functions
  const deleteTodo = (id) => {
    let arr = todos.filter((_, idx) => idx !== id);
    setTodos(arr);
  };

  return (
    <ul>
      {todos.map((todo, idx) => {
        return (
          <TodoItem
            todo={todo}
            setChecked={(state) => setChecked(idx, state)}
            deleteTodo={() => deleteTodo(idx)}
            key={todo.deadline.getTime() + idx} // Read about why this is required
          />
        );
      })}
    </ul>
  );
}
