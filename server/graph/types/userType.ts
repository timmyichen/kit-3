import { GraphQLObjectType } from 'graphql';
import userFields from './userFields';

export default new GraphQLObjectType({
  name: 'User',
  description: 'A user of the platform',
  fields: () => ({
    ...userFields,
  }),
});
