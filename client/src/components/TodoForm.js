import React from "react";
import Flatpickr from "react-flatpickr";

import "flatpickr/dist/themes/material_green.css";

export default function TodoForm({ submitTodo }) {
  const todoInput = React.useRef();
  const [deadline, setDeadline] = React.useState(new Date());
  const prioritySelect = React.useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    submitTodo({
      title: todoInput.current.value,
      deadline: deadline,
      priority: prioritySelect.current.value,
      done: false,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={todoInput}
        type="text"
        name="todo"
        style={{ fontSize: "1.5rem" }}
        placeholder="What do you want to do next?"
        required
      />
      <div className="flex justify-between basis-40">
        <label>
          Due on:
          <Flatpickr
            placeholder="Select date"
            value={deadline}
            onChange={(dates) => setDeadline(dates[0])}
            style={{ fontSize: "1.1rem" }}
            options={{
              minDate: new Date(),
              dateFormat: "M d, Y",
            }}
          />
        </label>
        <label>
          Priority
          <select
            style={{ fontSize: "1.1rem" }}
            name="priority"
            ref={prioritySelect}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>
      </div>
      <button type="submit" id="btn-submit">
        Add todo
      </button>
    </form>
  );
}
