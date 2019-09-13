import { GraphQLNonNull, GraphQLBoolean, GraphQLString } from 'graphql';
import { GraphQLContext } from 'server/routers/graphql';
import { sendPasswordResetEmail } from 'server/lib/emails';
import { UserInputError } from 'apollo-server';
import * as validator from 'validator';
import { Users } from 'server/models';
import * as bluebird from 'bluebird';
import { minutesInSeconds, genRedisKey, daysInSeconds } from 'server/lib/redis';

const crypto = bluebird.promisifyAll(require('crypto'));

interface Args {
  email: string;
}

export default {
  description: 'Upsert a phone number record',
  type: new GraphQLNonNull(GraphQLBoolean),
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(_: any, { email }: Args, { redis }: GraphQLContext) {
    if (!email || !validator.isEmail(email)) {
      throw new UserInputError('Invalid email');
    }

    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return true;
    }

    const requestedEmailRedisKey = genRedisKey.hasRequestedPasswordReset({
      email,
    });
    const resetTokenRedisKey = genRedisKey.passwordResetToken({
      userId: user.id,
    });

    const recentlyRequested = await redis.getAsync(requestedEmailRedisKey);

    if (recentlyRequested) {
      return true;
    }

    const buffer: Buffer = await crypto.randomBytesAsync(24);
    const newPasswordToken: string = buffer.toString('hex');

    try {
      await Promise.all([
        redis.setAsync(requestedEmailRedisKey, '1', 'ex', minutesInSeconds(10)),
        redis.setAsync(
          resetTokenRedisKey,
          newPasswordToken,
          'ex',
          daysInSeconds(1),
        ),
      ]);
      await sendPasswordResetEmail({ user, newPasswordToken });
    } catch (e) {
      await redis.delAsync(requestedEmailRedisKey, resetTokenRedisKey);
      throw e;
    }

    return true;
  },
};
