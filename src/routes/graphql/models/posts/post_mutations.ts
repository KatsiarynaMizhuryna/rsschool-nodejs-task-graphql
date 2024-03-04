import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLBoolean,
} from 'graphql';
import { PostType } from './Post.js';
import { PrismaClient, Post } from '@prisma/client/index.js';
import { UUIDType } from '../../types/uuid.js';

export type Context = { prisma: PrismaClient };

const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
});

export const ChangePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    content: { type: GraphQLString },
    title: { type: GraphQLString },
  },
});

export const PostMutations = {
  createPost: {
    type: PostType,
    args: {
      dto: { type: CreatePostInputType },
    },
    resolve: async (_, { dto }: { dto: Omit<Post, 'id'> }, { prisma }: Context) =>
      await prisma.post.create({ data: dto }),
  },
  deletePost: {
    type: GraphQLBoolean,
    args: {
      id: { type: UUIDType },
    },
    resolve: async (_, { id }: { id: string }, { prisma }: Context) => {
      await prisma.post.delete({ where: { id } });
      return null;
    },
  },
  changePost: {
    type: PostType,
    args: {
      id: { type: UUIDType },
      dto: { type: ChangePostInputType },
    },
    resolve: async (
      _,
      { id, dto }: { id: string; dto: Omit<Post, 'id'> },
      context: Context,
    ) =>
      await context.prisma.post.update({
        where: { id },
        data: dto,
      }),
  },
};
