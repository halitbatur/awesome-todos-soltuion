const express = require('express');
const passport = require('passport');
const routes = express.Router();
const jwt = require('jsonwebtoken');

routes.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email', 'openid'] })
);

routes.get('/me', (req, res) => {
  res.json(req.auth);
});

routes.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  function (req, res) {
    const cookieAge = 14 * 24 * 3600; // seconds of 14 days
    const { _id, name, email, providerId, profilePicture } = req.user;
    const payload = {
      name,
      email,
      providerId,
      avatar: profilePicture,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: cookieAge,
      subject: _id.toString(),
    });

    res.cookie('_t', token, {
      maxAge: cookieAge * 1000,
      httpOnly: true,
      signed: true,
    });

    res.redirect('/');
  }
);

routes.get('/logout', (req, res) => {
  res.clearCookie('_t');
  res.status(200).json({ success: true });
});

module.exports = routes;
