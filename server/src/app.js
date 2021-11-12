const express = require('express');
const cors = require('cors');

const app = express();

// app.use(cors());
app.use(express.json());

app.options('*', cors());

let todos = [
  { id: 'au1', text: 'Todo 1', done: false },
  { id: 'au2', text: 'Todo 2', done: false },
  { id: 'au3', text: 'Todo 3', done: true },
  { id: 'au4', text: 'Todo 4', done: false },
];

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.put('/api/todos/:id', (req, res) => {
  const { done } = req.body;
  const id = req.params.id;
  const idx = todos.findIndex((t) => t.id === id);
  todos[idx].done = done;
  res.json(todos[idx]);
});

app.delete('/api/todos/:id', (req, res) => {
  const id = req.params.id;
  todos = todos.filter((t) => t.id !== id);
  res.status(204).end();
});

app.post('/api/todos', (req, res) => {
  const todo = req.body;
  todo.id = `au${todos.length + 1}`;
  todo.done = false;
  todos.push(todo);
  res.json(todo);
});

const port = process.env.SERVER_PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
