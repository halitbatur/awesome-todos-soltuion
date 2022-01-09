const express = require('express');
const routes = express.Router();
const Todo = require('../models/Todo');

// GET /api/todos : Returns all TODOs
routes.get('/', async (req, res) => {
  const userId = req.auth.sub;
  const todos = await Todo.find({ user: userId });
  res.json(todos);
});

// PUT /api/todos/ID : Updates a single TODO
routes.put('/:id', async (req, res) => {
  const userId = req.auth.sub;
  const { done } = req.body;
  const id = req.params.id;

  const todo = await Todo.findById(id);

  if (!todo) {
    return res.status(404).json({ error: true, message: 'Item not found' });
  }

  // Allow only author to edit the TODO
  if (todo.user.toString() !== userId) {
    return res.status(401).json({
      error: true,
      message: "You don't have permission to update this item",
    });
  }

  todo.done = done;
  await todo.save();
  res.json(todo);
});

// DELETE /api/todos/ID : Deletes a single TODO
routes.delete('/:id', async (req, res) => {
  const userId = req.auth.sub;
  const id = req.params.id;

  const todo = await Todo.findById(id);

  if (!todo) {
    return res.status(404).json({ error: true, message: 'Item not found' });
  }

  // Allow only author to delete the TODO
  if (todo.user.toString() !== userId) {
    return res.status(401).json({
      error: true,
      message: "You don't have permission to delete this item",
    });
  }

  await Todo.findByIdAndDelete(id);
  res.status(204).end();
});

// POST /api/todos : Create a new TODO
routes.post('/', async (req, res) => {
  const userId = req.auth.sub;
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
    user: userId,
  });
  res.status(201).json(todo);
});

module.exports = routes;
