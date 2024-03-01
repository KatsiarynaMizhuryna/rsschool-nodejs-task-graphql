import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { PostType } from './Post.js';
import { PrismaClient } from '@prisma/client/index.js';
import { ProfileType } from './Profile.js';
import { UserType } from './User.js';
import { MemberType } from './Member.js';
import { MemberTypeId } from '../../member-types/schemas.js';

export type Context = { prisma: PrismaClient };

export const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_parent, _args, context: Context) => {
        const allUsers = await context.prisma.user.findMany();
        return allUsers;
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { id: userId }: { id: string }, context: Context) => {
        const user = await context.prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw new Error('User not found');
        }
        return user;
      },
    },

    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (_parent, _args, context: Context) => {
        const allProfiles = await context.prisma.profile.findMany();
        return allProfiles;
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { id: profileId }: { id: string }, context: Context) => {
        const profile = await context.prisma.profile.findUnique({
          where: { id: profileId },
        });

        return profile;
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_parent, _args, context: Context) => {
        const allPosts = await context.prisma.post.findMany();
        return allPosts;
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { id: postId }: { id: string }, context: Context) => {
        const post = await context.prisma.post.findUnique({
          where: { id: postId },
        });

        return post;
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: (_parent, _args, context: Context) => {
        const memberTypes = context.prisma.memberType.findMany();
        return memberTypes;
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (
        _parent,
        { id: MemberTypeId }: { id: MemberTypeId },
        context: Context,
      ) => {
        const member = await context.prisma.memberType.findUnique({
          where: { id: MemberTypeId },
        });

        return member;
      },
    },
  },
});
