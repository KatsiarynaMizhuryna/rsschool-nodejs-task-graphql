import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLString,
} from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import { MemberTypeEnumType } from '../members/Member.js';
import { ProfileType } from './Profile.js';
import { PrismaClient, Profile } from '@prisma/client/index.js';

export type Context = { prisma: PrismaClient };

const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeEnumType },
  },
});

const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: GraphQLString },
  },
});

export const ProfileMutations = {
  createProfile: {
    type: ProfileType,
    args: {
      dto: { type: CreateProfileInputType },
    },
    resolve: async (_, { dto }: { dto: Omit<Profile, 'id'> }, { prisma }: Context) =>
      await prisma.profile.create({ data: dto }),
  },

  deleteProfile: {
    type: GraphQLBoolean,
    args: {
      id: { type: UUIDType },
    },
    resolve: async (_, { id }: { id: string }, { prisma }: Context) => {
      await prisma.profile.delete({ where: { id } });
      return null;
    },
  },

  changeProfile: {
    type: ProfileType,
    args: {
      id: { type: UUIDType },
      dto: { type: ChangeProfileInputType },
    },
    resolve: async (
      _,
      { id, dto }: { id: string; dto: Omit<Profile, 'id'> },
      { prisma }: Context,
    ) =>
      await prisma.profile.update({
        where: { id },
        data: dto,
      }),
  },
};
