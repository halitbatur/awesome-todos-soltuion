const express = require('express');
const routes = express.Router();
const authRoutes = require('./auth');
const todosRoutes = require('./todos');

routes.use('/auth', authRoutes);
routes.use('/todos', todosRoutes);

module.exports = routes;
