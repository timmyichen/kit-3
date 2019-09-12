import { GraphQLNonNull } from 'graphql';
import { AuthenticationError } from 'apollo-server';
import userTodoType from '../types/userTodoType';
import { GraphQLContext } from 'server/routers/graphql';

export default {
  description: 'Get all of a users todos',
  type: new GraphQLNonNull(userTodoType),
  resolve(_1: any, _2: any, { user }: GraphQLContext) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    return user;
  },
};
