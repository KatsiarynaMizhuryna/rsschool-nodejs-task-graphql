import { GraphQLFloat, GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import { PostType } from '../posts/Post.js';
import { PrismaClient } from '@prisma/client/index.js';
import { ProfileType } from '../profiles/Profile.js';

export type Context = { prisma: PrismaClient };

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType,
      resolve: async (parent: { id: string }, _args, context: Context) => {
        const userProfile = await context.prisma.profile.findUnique({
          where: { userId: parent.id },
        });

        return userProfile;
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (parent: { id: string }, _args, context: Context) => {
        const userPosts = await context.prisma.post.findMany({
          where: { authorId: parent.id },
        });

        return userPosts;
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (parent: { id: string }, _args, context: Context) => {
        const userSubscribedTo = await context.prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: parent.id,
              },
            },
          },
        });

        return userSubscribedTo;
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (parent: { id: string }, _args, context: Context) => {
        const subscribedToUsers = await context.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: parent.id,
              },
            },
          },
        });

        return subscribedToUsers;
      },
    },
  }),
});
