const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const prisma = require("../../connectors/prisma");
const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy((username, password, done) => {
    return prisma.query.user({ where: { username } }).then(user => {
      if (!user) {
        return done(null, false);
      }
      const valid = bcrypt
        .compare(password, user.password)
        .then(valid => valid);
      if (!valid) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  prisma.query.user({ where: { id } }).then(user => done(null, user));
});

module.exports = passport;
