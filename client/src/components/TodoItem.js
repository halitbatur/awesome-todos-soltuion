import React from "react";

export default function TodoItem({ todo, setChecked, deleteTodo }) {
  const classes = ["todo-item", "flex"];

  todo.done && classes.push("checked");

  const handleCheck = (e) => {
    setChecked(e.target.checked);
  };

  return (
    <li className={classes.join(" ")}>
      <label className="todo-item-check-container">
        <input type="checkbox" checked={todo.done} onChange={handleCheck} />
      </label>
      <div className="todo-item-meta-container">
        <h3 className="todo-title">{todo.title}</h3>
        <div>
          <span className="todo-deadline">{todo.deadline.toDateString()}</span>
          <span className="todo-priority">{todo.priority}</span>
          <button className="todo-delete" onClick={deleteTodo}>
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
