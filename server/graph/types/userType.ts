import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { UserType } from '../../models/types';

export default new GraphQLObjectType({
  name: 'User',
  description: 'A user of the platform',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user: UserType) => user._id && user._id.toString(),
    },
    fullName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user: UserType) =>
        user.familyName
          ? user.givenName + ' ' + user.familyName
          : user.givenName,
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user: UserType) => user.email,
    },
  }),
});
