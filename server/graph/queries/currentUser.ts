import userType from 'server/graph/types/userType';
import { GraphQLContext } from 'server/routers/graphql';

export default {
  description: 'The currently authed user',
  type: userType,
  resolve(_1: any, _2: any, { user }: GraphQLContext) {
    return user || null;
  },
};
