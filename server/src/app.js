const express = require('express');
const passport = require('passport'); // PassportJS middleware
const GoogleStrategy = require('passport-google-oauth20').Strategy; // PassportJS Google OAuth 2.0 strategy
const cookieParser = require('cookie-parser'); // Express middleware for parsing cookie header and signing cookies. The parsed cookie is available as req.cookies.
const { encryptCookieNodeMiddleware } = require('encrypt-cookie'); // Express middleware for encrypting and decrypting cookies.
const jwt = require('express-jwt'); // Express middleware for validating JWTs through the jsonwebtoken module. The decoded JWT payload is available as req.user or req.auth.

const apiRoutes = require('./routes');
const db = require('./db');
const User = require('./models/User');

const port = process.env.PORT;

// Because OAuth uses redirection, a proxy port is required to
// redirect to the main proxy server that is defined in the OAuth app
const PROXY_PORT = process.env.PROXY_PORT ?? port;

if (!port && process.env.NODE_ENV !== 'test') {
  console.error('A port have to be specified in environment variable PORT');
  process.exit(1);
}

if (process.env.NODE_ENV !== 'test') {
  db.connect().then(() => {
    console.info('Connected to db');
  });
}

const app = express();

app.use(express.json());

// Let Express app use cookie middlewares with secret key for handling encryption of cookies
app.use(cookieParser(process.env.SECRET_KEY));
app.use(encryptCookieNodeMiddleware(process.env.SECRET_KEY));

// Let Express app use JWT middleware to be used on all routes starting with /api
app.use(
  '/api',
  jwt({
    secret: process.env.SECRET_KEY, // secret key is always required
    algorithms: ['HS256'], // encryption algorithm is always required
    requestProperty: 'auth', // This ensures that decoded token details will be available on req.auth else req.user is the default.
    getToken: (req) => req.signedCookies['_t'] ?? req.cookies['_t'],
  }).unless({ path: ['/api/auth/google', '/api/auth/google/callback'] })
);

// Let Express app use a middleware function that sends 401 error response code for auth errors and 500 for others
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

// Prepare Google Auth handling configuration
const googleConfigs = {
  clientID: process.env.GAPP_CLIENT_ID,
  clientSecret: process.env.GAPP_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/api/auth/google/callback',
};
const afterGoogleLogin = async function (
  accessToken,
  refreshToken,
  profile,
  cb
) {
  // In some cases it might be required to save user's access token and refresh token which are returned to us by Google.
  // For this assignment, we will not worry about these tokens.
  try {
    // Search if logged in user exists in the database
    let user = await User.findOne({ providerId: `google-${profile.id}` });
    if (!user) {
      // If user doesn't exist, create the user record on the database
      // In creating user record we use values shared by Google with us such as email, name, picture, etc.
      user = await User.create({
        email: profile.emails?.shift().value,
        name: profile.displayName,
        firstname: profile.name?.givenName,
        lastname: profile.name?.familyName,
        profilePicture: profile.photos?.shift().value,
        provider: 'google',
        providerId: `google-${profile.id}`,
      });
    }
    // Finally return user details
    cb(null, user.toJSON());
  } catch (err) {
    cb(err, null);
  }
};

// Configuring PassportJS Google OAuth 2.0 strategy on PassportJS instance
passport.use(
  // GoogleStrategy takes 2 arguments.
  new GoogleStrategy(
    // First argument is an object with client ID, client secret and callback URL.
    googleConfigs,
    // Second argument is a callback function to process authentication completion.
    afterGoogleLogin
  )
);

// Let Express app use configured and initialized PassportJS middleware
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
