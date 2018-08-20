// Current logged in user.
const currentUser = (obj, args, context) => context.user;
const users = (obj, args, context) => context.prisma.query.users();

module.exports = {
  currentUser,
  users
};
