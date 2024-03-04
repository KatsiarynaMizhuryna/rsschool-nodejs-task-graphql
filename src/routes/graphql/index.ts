import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Schema, createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      return await graphql({
        schema: Schema,
        source: query,
        variableValues: variables,
        contextValue: { prisma },
      });
    },
  });
};

export default plugin;
