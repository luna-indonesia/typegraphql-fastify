import 'reflect-metadata';
import * as fastify from 'fastify';
import { ApolloServer } from 'apollo-server-fastify';
import { ApolloServerPluginDrainHttpServer as apolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { buildSchema } from 'type-graphql';
import { PrismaClient } from '@prisma/client';

import { resolvers } from '@generated/type-graphql';
import { authChecker } from './authChecker';
import { fastifyAppClosePlugin } from './fastifyAppClosePlugin';

interface Context {
  prisma: PrismaClient;
}

export const startApolloServer = async () => {
  const app = fastify.fastify();
  const prisma = new PrismaClient();

  const schema = await buildSchema({
    resolvers,
    authChecker,
  });

  const server = new ApolloServer({
    schema,
    context: (): Context => ({ prisma }),
    plugins: [
      fastifyAppClosePlugin(app),
      apolloServerPluginDrainHttpServer({ httpServer: app.server }),
    ],
  });

  await server.start();

  app.register(server.createHandler());

  await app.listen(4000, (error, address) => {
    if (error) return app.log.error(error);
    console.log(`Server is currently ready at ${address}${server.graphqlPath}`);
  });
};
