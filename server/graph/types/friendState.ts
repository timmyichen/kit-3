import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { UserType } from '../../models/types';

export default new GraphQLObjectType({
  name: 'FriendState',
  description: 'The state of your friends',
  fields: () => ({
    friends: {
      type: new GraphQLList(GraphQLString),
      resolve: (user: UserType) => {},
    },
  }),
});
