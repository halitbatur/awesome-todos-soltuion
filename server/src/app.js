const express = require('express');
const apiRoutes = require('./routes');
const db = require('./db');

const port = process.env.PORT;

// Because OAuth uses redirection, a proxy port is required to
// redirect to the main proxy server that is defined in the OAuth app
const PROXY_PORT = process.env.PROXY_PORT ?? port;

if (!port) {
  console.error('A port have to be specified in environment variable PORT');
  process.exit(1);
}

db.connect().then(() => {});

const app = express();

app.use(express.json());

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`API Server started on port ${port}`);
  console.log(
    `Proxy server started on port ${PROXY_PORT}. Head to http://localhost:${PROXY_PORT} and start hacking.`
  );
});
