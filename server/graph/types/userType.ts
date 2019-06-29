import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';

export default new GraphQLObjectType({
  name: 'User',
  description: 'A user of the platform',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user: any) => user.id,
    },
    fullName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user: any) =>
        user.familyName
          ? user.givenName + ' ' + user.familyName
          : user.givenName,
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user: any) => user.email,
    },
  }),
});
