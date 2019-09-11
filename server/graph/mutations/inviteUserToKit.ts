import * as express from 'express';
import { GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { AuthenticationError, UserInputError } from 'apollo-server';
import * as validator from 'validator';
import { genRedisKey, sendInviteEmail } from 'server/lib/emails';
import { getAsync, setAsync } from 'server/lib/redis';
import { Users } from 'server/models';

interface Args {
  email: string;
}

const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export default {
  description: 'Invites a user to KIT',
  type: new GraphQLNonNull(GraphQLBoolean),
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(_: any, { email }: Args, { user }: express.Request) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    if (!validator.isEmail(email)) {
      throw new UserInputError('Invalid email');
    }

    const existingUser = await Users.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new UserInputError('That user is already on KIT');
    }

    const redisKey = genRedisKey.wasInvitedToKit({ email });
    const exists = !!(await getAsync(redisKey));

    if (exists) {
      throw new UserInputError(
        `${email} has been already been invited to KIT recently`,
      );
    }

    await sendInviteEmail({ invitingUser: user, email });
    await setAsync(redisKey, '1', 'ex', ONE_WEEK_IN_SECONDS);

    return true;
  },
};
