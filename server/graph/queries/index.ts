import { GraphQLObjectType } from 'graphql';
import currentUser from './currentUser';

export default new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    currentUser,
  }),
});
