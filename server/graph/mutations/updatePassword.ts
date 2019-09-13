import * as bluebird from 'bluebird';
import { GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { Users } from 'server/models';
import { GraphQLContext } from 'server/routers/graphql';
const bcrypt = bluebird.promisifyAll(require('bcrypt-nodejs'));

interface Args {
  passwordVerification: string;
  newPassword: string;
}

export default {
  description: 'Update the users password',
  type: new GraphQLNonNull(GraphQLBoolean),
  args: {
    passwordVerification: { type: new GraphQLNonNull(GraphQLString) },
    newPassword: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(_: any, args: Args, req: GraphQLContext) {
    if (!req.user) {
      throw new AuthenticationError('Must be logged in');
    }

    const user: Users | null = await Users.findByPk(req.user.id);

    if (!user) {
      throw new AuthenticationError(
        'Something must have really gone wrong but this is only here to appease TypeScript',
      );
    }

    const isValid = await bcrypt.compareAsync(
      args.passwordVerification,
      user.password,
    );

    if (!isValid) {
      throw new UserInputError('Password verification failed');
    }

    if (args.newPassword.length < 8) {
      throw new UserInputError('Password must be at least 8 characters');
    }

    const salt = await bcrypt.genSaltAsync(10);
    const hash = await bcrypt.hashAsync(args.newPassword, salt, null);

    await user.update({ password: hash });

    return true;
  },
};
