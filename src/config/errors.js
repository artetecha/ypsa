const createError = require("apollo-errors").createError;

module.exports.UnknownError = createError("UnknownError", {
  message: "An unknown error has occurred!  Please try again later"
});

module.exports.AuthenticationRequiredError = createError(
  "AuthenticationRequiredError",
  {
    message: "You must be logged in to do this"
  }
);

module.exports.AlreadyAuthenticatedError = createError(
  "AlreadyAuthenticatedError",
  {
    message: "You already are logged in"
  }
);

module.exports.AuthenticationError = createError("AuthenticationError", {
  message: "Authentication failed"
});

module.exports.UserExistsError = createError("UserExistsError", {
  message:
    "Sorry, the username and/or email you've been using are already in use."
});
