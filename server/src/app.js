const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const { encryptCookieNodeMiddleware } = require('encrypt-cookie');
const jwt = require('express-jwt');
const apiRoutes = require('./routes');
const googleStrategy = require('./google');
const db = require('./db');

const port = process.env.PORT;

// Because OAuth uses redirection, a proxy port is required to
// redirect to the main proxy server that is defined in the OAuth app
const PROXY_PORT = process.env.PROXY_PORT ?? port;

if (!port) {
  console.error('A port have to be specified in environment variable PORT');
  process.exit(1);
}

if (process.env.NODE_ENV !== 'test') {
  db.connect().then(() => {
    console.info('Connected to db');
  });
}

const app = express();

passport.use(
  googleStrategy({
    clientID: process.env.GAPP_CLIENT_ID,
    clientSecret: process.env.GAPP_CLIENT_SECRET,
    callbackURL: getCallbackURL('/api/auth/google/callback', PROXY_PORT),
  })
);

app.use(express.json());
app.use(cookieParser(process.env.SECRET_KEY));
app.use(encryptCookieNodeMiddleware(process.env.SECRET_KEY));
app.use(
  '/api',
  jwt({
    secret: process.env.SECRET_KEY,
    algorithms: ['HS256'],
    credentialsRequired: true,
    requestProperty: 'auth',
    getToken: (req) => req.signedCookies['_t'] ?? req.cookies['_t'],
  }).unless({ path: ['/api/auth/google', '/api/auth/google/callback'] })
);

// Error handling
app.use(function (err, req, res, _next) {
  if (err.name === 'UnauthorizedError') {
    res
      .status(401)
      .json({ error: true, message: `Invalid Token: ${err.message}` });
  } else {
    res
      .status(500)
      .json({ error: true, message: 'Internal server error occured' });
  }
});

app.use(passport.initialize());

app.use('/api', apiRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`API Server started on port ${port}`);
    console.log(
      `Proxy server started on port ${PROXY_PORT}. Head to http://localhost:${PROXY_PORT} and start hacking.`
    );
  });
}

module.exports = app;

function getCallbackURL(path, port) {
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  const GITPOD_WS_URL = process.env.GITPOD_WORKSPACE_URL;
  if (GITPOD_WS_URL) {
    let url = new URL(GITPOD_WS_URL + path);
    url.host = `${port}-${url.host}`;
    return url.toString();
  } else {
    let url = new URL(`http://localhost:${port}${path}`);
    return url.toString();
  }
}
