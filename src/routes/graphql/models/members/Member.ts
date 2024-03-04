import { GraphQLInt, GraphQLObjectType, GraphQLEnumType, GraphQLFloat } from 'graphql';
import { MemberTypeId } from '../../../member-types/schemas.js';

export const MemberTypeEnumType = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: MemberTypeId.BASIC },
    business: { value: MemberTypeId.BUSINESS },
  },
});

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: MemberTypeEnumType },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});
