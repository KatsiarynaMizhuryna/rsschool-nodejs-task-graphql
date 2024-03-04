import { GraphQLObjectType } from 'graphql';
import { PostMutations } from './posts/post_mutations.js';
import { ProfileMutations } from './profiles/profile_mutations.js';
import { UserMutations } from './users/user_mutations.js';

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...UserMutations,
    ...PostMutations,
    ...ProfileMutations,
  }),
});
