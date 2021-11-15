const express = require('express');
const routes = express.Router();
const Todo = require('../models/Todo');

routes.get('/', async (req, res) => {
  const userId = req.auth.sub;
  const todos = await Todo.find({ user: userId });
  res.json(todos);
});

routes.put('/:id', async (req, res) => {
  const userId = req.auth.sub;
  const { done } = req.body;
  const id = req.params.id;

  const todo = await Todo.findById(id);
  console.log(todo, userId);

  if (!todo) {
    return res.status(404).json({ error: true, message: 'Item not found' });
  }

  if (todo.user.toString() !== userId) {
    return res.status(403).json({
      error: true,
      message: "You don't have permission to update this item",
    });
  }

  todo.done = done;
  await todo.save();
  res.json(todo);
});

routes.delete('/:id', async (req, res) => {
  const userId = req.auth.sub;
  const id = req.params.id;

  const todo = await Todo.findById(id);

  if (!todo) {
    return res.status(404).json({ error: true, message: 'Item not found' });
  }

  if (todo.user.toString() !== userId) {
    return res.status(403).json({
      error: true,
      message: "You don't have permission to delete this item",
    });
  }

  await Todo.findByIdAndDelete(id);
  res.status(204).end();
});

routes.post('/', async (req, res) => {
  const userId = req.auth.sub;
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
    user: userId,
  });
  res.json(todo);
});

module.exports = routes;
