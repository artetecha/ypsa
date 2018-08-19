const {
  AuthenticationRequiredError,
  AlreadyAuthenticatedError
} = require("../config/errors");

const { SchemaDirectiveVisitor } = require("graphql-tools");

class AuthenticationRequiredDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = (...args) => {
      const [, , context] = args;
      if (!context.user) throw new AuthenticationRequiredError();
      return resolve.apply(this, args);
    };
  }
}

class AnonymityRequiredDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = (...args) => {
      const [, , context] = args;
      if (context.user) throw new AlreadyAuthenticatedError();
      return resolve.apply(this, args);
    };
  }
}

const schemaDirectives = {
  authenticationRequired: AuthenticationRequiredDirective,
  anonymityRequired: AnonymityRequiredDirective
};

module.exports = {
  schemaDirectives
};
