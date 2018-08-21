// Server.
const server = {
  port: process.env.PORT || 4000,
  endpoint: "/",
  playground: "/",
  subscriptions: false,
  cors: {
    origin: [/https?:\/\/.*/],
    credentials: true
  }
};

// Session.
const session = {
  secret: "94300f8f4ab239a8b06b35a5eac70067756cbf91"
};

const prisma = {
  endpoint: "http://localhost:4466",
  secret: "94300f8f4ab239a8b06b35a5eac70067756cbf91"
};

module.exports = {
  schema: require("path").normalize(__dirname + "/../schema/schema.graphql"),
  server,
  session,
  prisma
};
