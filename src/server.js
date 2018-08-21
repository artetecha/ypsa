const { GraphQLServer } = require("graphql-yoga");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const passport = require("./middleware/passport");
const prisma = require("./connectors/prisma");
const config = require("./config");

// Schema.
const typeDefs = config.schema;
// Resolvers.
const resolvers = require("./resolvers");
// Directives.
const schemaDirectives = require("./directives");

// Instantiate server.
const server = new GraphQLServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  context: ({ request }) => ({
    // Auth essentials.
    // NB: a simple reference to the request.{login|logout} functions will not work,
    // as the Express server is instantiated by Yoga _after_ this piece of code.
    login: (user, err) => request.login(user, err),
    logout: () => request.logout(),
    user: request.user,
    prisma
  })
});

server.express.use(
  session({
    secret: config.session.secret,
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    saveUninitialized: true,
    resave: true
  })
);

// Passport initialisation.
server.express.use(passport.initialize());
server.express.use(passport.session());

server.start(config.server, ({ port, endpoint }) =>
  console.log(`> Server is ready on http://localhost:${port}${endpoint}`)
);
