import * as bluebird from 'bluebird';
import { GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { UserInputError } from 'apollo-server';
import { Users } from 'server/models';
import { GraphQLContext } from 'server/routers/graphql';
import { genRedisKey } from 'server/lib/redis';
const bcrypt = bluebird.promisifyAll(require('bcrypt-nodejs'));

interface Args {
  token: string;
  newPassword: string;
}

export default {
  description: 'Update the users password from a reset',
  type: new GraphQLNonNull(GraphQLBoolean),
  args: {
    token: { type: new GraphQLNonNull(GraphQLString) },
    newPassword: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(_: any, args: Args, { redis }: GraphQLContext) {
    const [userIdAsString, token] = args.token.split(':');

    if (!userIdAsString || !token) {
      throw new UserInputError('Invalid token');
    }

    const userId = parseInt(userIdAsString, 10);

    const user = await Users.findByPk(userId);

    if (!user) {
      throw new UserInputError('User not found');
    }

    if (args.newPassword.length < 8) {
      throw new UserInputError('Password cannot must be at least 8 characters');
    }

    const redisKey = genRedisKey.passwordResetToken({ userId });
    const emailRedisKey = genRedisKey.hasRequestedPasswordReset({
      email: user.email,
    });
    const storedToken = await redis.getAsync(redisKey);

    if (storedToken !== token) {
      throw new UserInputError('Password reset token invalid or expired.');
    }

    const isTheSame = await bcrypt.compareAsync(
      args.newPassword,
      user.password,
    );

    if (isTheSame) {
      throw new UserInputError("That's your current password you dummy");
    }

    const salt = await bcrypt.genSaltAsync(10);
    const hash = await bcrypt.hashAsync(args.newPassword, salt, null);

    await user.update({ password: hash });

    await Promise.all([
      redis.delAsync(redisKey),
      redis.delAsync(emailRedisKey),
    ]);

    return true;
  },
};
