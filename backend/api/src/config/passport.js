const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { PrismaClient } = require('@prisma/client');
const { sendOAuthLoginNotification } = require('../services/email.service');

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'placeholder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder',
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
        let user = await prisma.user.findFirst({
          where: { googleId: profile.id },
        });

        if (user) {
          
          if (avatar && user.avatar !== avatar) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { avatar }
            });
          }
        } else {
          
          const email = profile.emails[0].value;
          user = await prisma.user.findUnique({ where: { email } });

          if (user) {
            
            user = await prisma.user.update({
              where: { email },
              data: { googleId: profile.id, avatar },
            });
          } else {
            
            user = await prisma.user.create({
              data: {
                email,
                name: profile.displayName,
                googleId: profile.id,
                avatar,
              },
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
      callbackURL: '/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
        let user = await prisma.user.findFirst({
          where: { githubId: profile.id.toString() },
        });

        if (user) {
          
          if (avatar && user.avatar !== avatar) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { avatar }
            });
          }
        } else {
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.com`;
          user = await prisma.user.findUnique({ where: { email } });

          if (user) {
            user = await prisma.user.update({
              where: { email },
              data: { githubId: profile.id.toString(), avatar },
            });
          } else {
            user = await prisma.user.create({
              data: {
                email,
                name: profile.displayName || profile.username,
                githubId: profile.id.toString(),
                avatar,
              },
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
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
