const express = require('express');
const routes = express.Router();

routes.get('/google', (req, res) => {
  res.end();
});

routes.get('/me', (req, res) => {
  res.end();
});

routes.get('/google/callback', function (req, res) {
  res.end();
});

routes.get('/logout', (req, res) => {
  res.end();
});

module.exports = routes;
