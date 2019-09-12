import { GraphQLNonNull, GraphQLInt } from 'graphql';
import { AuthenticationError, UserInputError } from 'apollo-server';
import {
  FriendRequests,
  BlockedUsers,
  Friendships,
  Users,
} from 'server/models';
import { db } from 'server/lib/db';
import userType from '../types/userType';
import { GraphQLContext } from 'server/routers/graphql';
import { sendFriendRequestEmail, genRedisKey } from 'server/lib/emails';
import { daysInSeconds } from 'server/lib/redis';

export default {
  description: 'Request a user to be your friend',
  type: GraphQLNonNull(userType),
  args: {
    targetUserId: { type: new GraphQLNonNull(GraphQLInt) },
  },
  async resolve(
    _: any,
    { targetUserId }: { targetUserId: number },
    { user, redis }: GraphQLContext,
  ) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    if (!targetUserId) {
      throw new UserInputError('Target user not found');
    }

    const targetUser = await Users.findByPk(targetUserId);

    if (!targetUser) {
      throw new UserInputError('Target user not found');
    }

    if (targetUserId === user.id) {
      throw new UserInputError('Cant add yourself you cray');
    }
    const [
      isRequested,
      reverseRequest,
      isBlocked,
      isFriends,
    ] = await Promise.all([
      FriendRequests.findOne({
        where: {
          target_user: targetUserId,
          requested_by: user.id,
        },
      }),
      FriendRequests.findOne({
        where: {
          target_user: user.id,
          requested_by: targetUserId,
        },
      }),
      BlockedUsers.findOne({
        where: {
          target_user: user.id,
          blocked_by: targetUserId,
        },
      }),
      Friendships.findOne({
        where: {
          first_user: user.id,
          second_user: targetUserId,
        },
      }),
    ]);

    if (isBlocked) {
      throw new UserInputError('Target user not found');
    }

    if (isRequested) {
      throw new UserInputError('Already requested');
    }

    if (isFriends) {
      throw new UserInputError('Already friends');
    }

    if (reverseRequest) {
      await db.transaction(async (transaction: any) => {
        await Promise.all([
          Friendships.create(
            {
              first_user: user.id,
              second_user: targetUserId,
            },
            {
              transaction,
            },
          ),
          Friendships.create(
            {
              first_user: targetUserId,
              second_user: user.id,
            },
            {
              transaction,
            },
          ),
          reverseRequest.destroy({ transaction }),
        ]);
      });
    } else {
      await FriendRequests.create({
        target_user: targetUserId,
        requested_by: user.id,
      });

      const opts = { requestedUser: targetUser, requestingUser: user };

      const redisKey = genRedisKey.wasAddedAsFriend(opts);

      if (!(await redis.getAsync(redisKey))) {
        await Promise.all([
          sendFriendRequestEmail(opts),
          redis.setAsync(redisKey, '1', 'ex', daysInSeconds(7)),
        ]);
      }
    }

    return targetUser;
  },
};
