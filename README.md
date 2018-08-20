**YPSA** stands for [**Y**oga](https://github.com/prisma/graphql-yoga) [**P**risma](https://github.com/prisma/prisma) **S**ession-based **A**uthentication.

It is very common to find examples of GraphQL authentication implemented with [JSON Web Tokens](https://jwt.io/), not so common to find a standard session-based one. So, here we are.

This example was also a playground for me to play with GraphQL Yoga, Prisma and GraphQL directives. If you are only after the bit that implements the session-based authentication, I am sure you will have no trouble extracting it from this example.

You can likewise decide to play with example and change it to your likeness, swapping Prisma for another back-end, or rely on plain Apollo Server rather than Yoga, etc.

## First things first

This example uses Prisma Enterprise Open Source package rather than the Prisma Cloud Service. I set up the my Prisma server with a Postgres DB using [the official guide](https://www.prisma.io/docs/tutorials/setup-prisma/create-new-db/postgres-eiyov7erah).

So you will need…

### Docker

If you don't have Docker installed already, you can download it for your platform using the following links:

- [Mac](https://store.docker.com/editions/community/docker-ce-desktop-mac)
- [Windows](https://store.docker.com/editions/community/docker-ce-desktop-windows)
- [Other](https://www.docker.com/get-docker)

### Prisma CLI

```bash
$ npm install -g prisma
# or
# yarn global add prisma
```

## Get started

```bash
$ git checkout git@github.com:artetecha/ypsa.git
$ cd ypsa
$ docker-machine up -d
$ prisma deploy
$ yarn install # you can use npm, but bear in mind this repo provides no package-lock.json
$ yarn start # or yarn run dev if you want to start the app via nodemon and play with your changes
```

### Enabling sessions in GraphQL Playground

Yoga comes with [GraphQL Playground](https://github.com/prisma/graphql-playground) rather than the usual [GraphiQL](https://github.com/graphql/graphiql). Playground by default does not have sessions enabled, and Yoga doesn’t expose its options yet, so I couldn’t make the server start with different defaults. So there’s one more thing you have to do before you start authenticating:

1. Go to the local server URL (http://localhost:4000/graphql)
2. Click on the cogwheel icon to access the settings
3. Change the value of `request.credentials` from `omit` to `include`
4. Save the settings

## Default user

There’s a default user, because the server comes with the `register` mutation locked for authenticated user, i.e. you need to be logged-in in order to register more users. The default user’s credentials are:

```
username: nooneknows
password: nooneknows
```

## Queries and Mutations

This server ships with the following queries:

| **Query**     | **Function**                           | **Access**              |
| ------------- | -------------------------------------- | ----------------------- |
| `currentUser` | Shows the currently authenticated user | All                     |
| `users`       | Shows a list of users                  | Private (auth required) |

and the following mutations:

| **Mutation** | **Function**                                    | **Access**                        |
| ------------ | ----------------------------------------------- | --------------------------------- |
| `login`      | Allows authentication via username and password | Anonymous (must not be logged-in) |
| `logout`     | Log out                                         | Private (auth required)           |
| `register`   | Sign a new user up                              | Private (auth required)           |

## Directives

I decided to user GraphQL directives to implement authentication. This means you can easily change the access level of a specific query/mutation by adding/removing one of the available directives. See `src/schema/schema.graphql` for more information.
