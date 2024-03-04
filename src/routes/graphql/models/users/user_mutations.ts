import { UUIDType } from '../../types/uuid.js';
import { UserType } from './User.js';
import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLString,
  GraphQLFloat,
} from 'graphql';
import { PrismaClient, User } from '@prisma/client/index.js';

export type Context = { prisma: PrismaClient };

const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

export const UserMutations = {
  createUser: {
    type: UserType,
    args: {
      dto: { type: CreateUserInputType },
    },
    resolve: async (_, { dto }: { dto: Omit<User, 'id'> }, { prisma }: Context) =>
      await prisma.user.create({ data: dto }),
  },

  deleteUser: {
    type: GraphQLBoolean,
    args: {
      id: { type: UUIDType },
    },
    resolve: async (_, { id }: { id: string }, { prisma }: Context) => {
      await prisma.user.delete({ where: { id } });
      return null;
    },
  },

  changeUser: {
    type: UserType,
    args: {
      id: { type: UUIDType },
      dto: { type: ChangeUserInputType },
    },
    resolve: async (
      _,
      { id, dto }: { id: string; dto: Omit<User, 'id'> },
      { prisma }: Context,
    ) =>
      await prisma.user.update({
        where: { id },
        data: dto,
      }),
  },
  subscribeTo: {
    type: UserType,
    args: {
      userId: { type: UUIDType },
      authorId: { type: UUIDType },
    },
    resolve: async (
      _,
      { userId, authorId }: { userId: string; authorId: string },
      { prisma }: Context,
    ) => {
      return await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          userSubscribedTo: {
            create: {
              authorId: authorId,
            },
          },
        },
      });
    },
  },

  unsubscribeFrom: {
    type: GraphQLBoolean,
    args: {
      userId: { type: new GraphQLNonNull(UUIDType) },
      authorId: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (
      _,
      { userId, authorId }: { userId: string; authorId: string },
      { prisma }: Context,
    ) => {
      await prisma.subscribersOnAuthors.delete({
        where: {
          subscriberId_authorId: {
            subscriberId: userId,
            authorId: authorId,
          },
        },
      });
      return true;
    },
  },
};
