const express = require('express');
const routes = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken'); // A NodeJS module to implement JWTs

// GET /api/auth/me : Returns authentication info or user profile info
routes.get('/me', (req, res) => {
  res.json(req.auth);
});

// GET /api/auth/google : Executes PassportJS authentication
routes.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email', 'openid'] })
);

// GET /api/auth/google/callback : Callback or Redirect URL after Google authentication completed
// This is how Google returns control to our application after Google login page
routes.get(
  '/google/callback',
  // In case of failed authentication, redirect to home page. This can also be an error page in some cases.
  // Also, disable PassportJS sessions since we want to use JWTs.
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  function (req, res) {
    // Fetch and configure user details required to create JWT
    const cookieAge = 14 * 24 * 3600; // 14 days converted to seconds
    const { _id, name, email, providerId, profilePicture } = req.user;
    const payload = {
      name,
      email,
      providerId,
      avatar: profilePicture,
    };

    // Create signed JWT using jsonwebtoken package
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: cookieAge,
      subject: _id.toString(),
    });

    // Set cookie with name '_t' and above signed JWT
    // Set HTTP only to ensure that cookie is accessible only by the server, this creates additional layer of security on the client end
    res.cookie('_t', token, {
      maxAge: cookieAge * 1000,
      httpOnly: true,
      signed: true,
    });

    // Redirect to home page after all authentication and subsequent operations completed
    res.redirect('/');
  }
);

// GET /api/auth/logout : Clear JWT stored in cookies to execute logout operation
routes.get('/logout', (req, res) => {
  res.clearCookie('_t');
  res.status(200).json({ success: true });
});

module.exports = routes;
