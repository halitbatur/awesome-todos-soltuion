const express = require('express');
const routes = express.Router();
const Todo = require('../models/Todo');

routes.get('/', (req, res) => {
  res.json([]);
});

routes.put('/:id', (req, res) => {
  res.json({});
});

routes.delete('/:id', (req, res) => {
  res.status(204).end();
});

routes.post('/', (req, res) => {
  res.json({});
});

module.exports = routes;
