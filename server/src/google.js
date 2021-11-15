const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');

const strategy = ({ clientID, clientSecret, callbackURL }) =>
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        let user = await User.findOne({ providerId: `google-${profile.id}` });
        if (!user) {
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
        cb(null, user.toJSON());
      } catch (err) {
        cb(err, null);
      }
    }
  );

module.exports = strategy;
