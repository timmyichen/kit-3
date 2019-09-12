import { GraphQLNonNull, GraphQLBoolean } from 'graphql';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { sendVerificationEmail } from 'server/lib/emails';
import { GraphQLContext } from 'server/routers/graphql';

export default {
  description: 'Request the verification email be resent',
  type: new GraphQLNonNull(GraphQLBoolean),
  async resolve(_: any, __: any, { user }: GraphQLContext) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    if (user.is_verified) {
      throw new UserInputError('You are already verified');
    }

    await sendVerificationEmail({ user });

    return true;
  },
};
