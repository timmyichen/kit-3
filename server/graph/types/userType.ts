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
        user.family_name
          ? user.given_name + ' ' + user.family_name
          : user.given_name,
    },
    username: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user: any) => user.username,
    },
  }),
});
