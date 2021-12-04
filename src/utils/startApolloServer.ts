import "reflect-metadata";
import * as fastify from 'fastify';
import { ApolloServer } from 'apollo-server-fastify';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { buildSchema } from "type-graphql";
import { fastifyAppClosePlugin } from './fastifyAppClosePlugin';
import { resolvers } from "@generated/type-graphql";

export const startApolloServer = async () => {
  const app = fastify.fastify();

  const schema = await buildSchema({
    resolvers,
  })

  const server = new ApolloServer({
    schema,
    plugins: [
      fastifyAppClosePlugin(app),
      ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
    ],
  });

  await server.start();

  app.register(server.createHandler());

  await app.listen(4000, (error, address) => {
    if ( error ) return app.log.error(error)
    console.log(`Server is currently ready at ${address}${server.graphqlPath}`);
  });
}