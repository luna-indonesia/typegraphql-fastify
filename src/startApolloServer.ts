import 'reflect-metadata';
import * as fastify from 'fastify';
import authChecker from 'typegraphql-authchecker';
import { ApolloServer } from 'apollo-server-fastify';
import { ApolloServerPluginDrainHttpServer as aspdhs } from 'apollo-server-core';
import { buildSchema } from 'type-graphql';
import { fastifyAppClosePlugin, Context, context } from './libs';

import { resolvers } from './generated/typegraphql';

export const startApolloServer = async () => {
  const app = fastify.fastify({ logger: true });

  const schema = await buildSchema({
    resolvers,
    emitSchemaFile: true,
    authChecker: authChecker,
  });

  const server = new ApolloServer({
    schema,
    context: (): Context => context,
    plugins: [fastifyAppClosePlugin(app), aspdhs({ httpServer: app.server })],
  });

  await server.start();

  app.register(server.createHandler());

  await app.listen(4000, '0.0.0.0', (error, address) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    console.log(`Server is currently ready at ${address}${server.graphqlPath}`);
  });
};
