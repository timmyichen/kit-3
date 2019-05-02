import { GraphQLObjectType } from 'graphql';
import { User } from 'server/models';

export default new GraphQLObjectType({
  name: 'BudgetPeriod',
  description: 'A budget for a period of time',
  fields: () => ({
    owner: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user: UserType) => user.id && user.id.toString(),
    },
  }),
});
