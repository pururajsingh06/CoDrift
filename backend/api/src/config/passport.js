const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');
const { sendOAuthLoginNotification } = require('../services/email.service');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'placeholder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder',
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:3000'}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          if (avatar && user.avatar !== avatar) {
            user = await User.findByIdAndUpdate(user._id, { avatar }, { new: true });
          }
        } else {
          const email = profile.emails[0].value;
          user = await User.findOne({ email });

          if (user) {
            user = await User.findByIdAndUpdate(user._id, { googleId: profile.id, avatar }, { new: true });
          } else {
            user = await User.create({
              email,
              name: profile.displayName,
              googleId: profile.id,
              avatar,
            });
          }
        }
        
        sendOAuthLoginNotification(user.email, user.name, 'Google');
        
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || 'placeholder',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'placeholder',
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:3000'}/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
        let user = await User.findOne({ githubId: profile.id.toString() });

        if (user) {
          if (avatar && user.avatar !== avatar) {
            user = await User.findByIdAndUpdate(user._id, { avatar }, { new: true });
          }
        } else {
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.com`;
          user = await User.findOne({ email });

          if (user) {
            user = await User.findByIdAndUpdate(user._id, { githubId: profile.id.toString(), avatar }, { new: true });
          } else {
            user = await User.create({
              email,
              name: profile.displayName || profile.username,
              githubId: profile.id.toString(),
              avatar,
            });
          }
        }

        sendOAuthLoginNotification(user.email, user.name, 'GitHub');

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
