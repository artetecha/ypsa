const passport = require("../../middleware/passport");
const { AuthenticationError } = require("../../config/errors");
const bcrypt = require("bcrypt");

// Login.
const login = (obj, { username, password }, context) => {
  if (!context.user) {
    return new Promise((resolve, reject) => {
      passport.authenticate("local", (err, user) => {
        if (err) {
          reject(new Error());
        }
        if (!user) {
          reject(new AuthenticationError());
        }
        context.login(user, error => {
          if (error) {
            reject(error);
          }
          resolve(user);
        });
      })({ body: { username, password } });
    });
  }
};

// Register.
const register = (obj, { username, email, password }, context) =>
  bcrypt.hash(password, 10).then(password =>
    context.prisma.mutation.createUser({
      data: { username, email, password }
    })
  );

// Logout.
const logout = (obj, args, context) => {
  if (context.user) {
    context.logout();
  }
  return { result: true };
};

module.exports = {
  login,
  logout,
  register
};
