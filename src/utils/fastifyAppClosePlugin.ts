import * as fastify from 'fastify';

export const fastifyAppClosePlugin = (app: fastify.FastifyInstance) => {
  return {
    async serverWillStart() {
      return {
        async drainServer() {
          await app.close();
        }
      };
    },
  };
}