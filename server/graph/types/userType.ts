import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { UserType } from '../../models/types';

export default new GraphQLObjectType({
  name: 'User',
  description: 'A user of the platform',
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user: UserType) => user.name,
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user: UserType) => user.email,
    },
  }),
});
