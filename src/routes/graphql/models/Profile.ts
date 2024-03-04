import { GraphQLBoolean, GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { MemberType } from './Member.js';
import { PrismaClient } from '@prisma/client/index.js';

export type Context = { prisma: PrismaClient };

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: GraphQLString },
    memberType: {
      type: MemberType,
      resolve: async (parent: { memberTypeId: string }, _args, context: Context) => {
        return await context.prisma.memberType.findUnique({
          where: { id: parent.memberTypeId },
        });
      },
    },
  }),
});
