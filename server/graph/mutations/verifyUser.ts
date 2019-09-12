import { GraphQLNonNull, GraphQLString } from 'graphql';
import { AuthenticationError, UserInputError } from 'apollo-server';
import userType from '../types/userType';
import { doesEmailMatchHash } from 'server/lib/verifyEmail';
import { Users } from 'server/models';
import { GraphQLContext } from 'server/routers/graphql';

interface Args {
  hash: string;
}

export default {
  description: 'Verify a user',
  type: new GraphQLNonNull(userType),
  args: {
    hash: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(_: any, { hash }: Args, { user }: GraphQLContext) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    if (!doesEmailMatchHash(user.email, hash)) {
      throw new UserInputError('Invalid token');
    }

    const [, updatedUsers] = await Users.update(
      {
        is_verified: true,
      },
      {
        where: { id: user.id },
        limit: 1,
        returning: true,
      },
    );

    return updatedUsers[0];
  },
};
