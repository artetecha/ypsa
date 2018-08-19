const { GraphQLServer } = require("graphql-yoga");
const session = require("express-session");
const resolvers = require("./resolvers");
const passport = require("./middleware/passport");
const prisma = require("./connectors/prisma");
const config = require("./config");
const { schemaDirectives } = require("./directives");

// Schema.
const typeDefs = config.schema;

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
    saveUninitialized: true,
    resave: true,
    cookie: { secure: false }
  })
);

// Passport initialisation.
server.express.use(passport.initialize());
server.express.use(passport.session());

// This is here mainly for when the app runs in the local docker container.
// Lando displays a red (meaning "broken") URL when an app does not respond
// correctly on the root. I guess Lando should stop making assumptions.
server.express.get("/", (req, res) => {
  res.redirect(301, `${config.server.endpoint}`);
});

server.start(config.server, ({ port, endpoint }) =>
  console.log(`> Server is ready on http://localhost:${port}${endpoint}`)
);
