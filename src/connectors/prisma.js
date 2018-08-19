const { Prisma } = require("prisma-binding");
const config = require("../config");

module.exports = new Prisma({
  typeDefs: require("path").normalize(__dirname + "/../schema/prisma.graphql"), // the auto-generated GraphQL schema of the Prisma API
  endpoint: config.prisma.endpoint,
  debug: false // if true, it will log all GraphQL operations sent to the Prisma API
  // secret: config.prisma.secret, // only needed if specified in `database/prisma.yml`
});
