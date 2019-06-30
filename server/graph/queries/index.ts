import { GraphQLObjectType } from 'graphql';
import currentUser from './currentUser';
import searchUsers from './searchUsers';

export default new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    currentUser,
    searchUsers,
  }),
});
