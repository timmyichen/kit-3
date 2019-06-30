import * as express from 'express';
import { GraphQLBoolean, GraphQLNonNull, GraphQLInt } from 'graphql';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { FriendRequests, BlockedUsers, Friendships, Users } from '../../models';
import { db } from '../../lib/db';

export default {
  description: 'Request a user to be your friend',
  type: GraphQLBoolean,
  args: {
    targetUserId: { type: new GraphQLNonNull(GraphQLInt) },
  },
  async resolve(
    _: any,
    { targetUserId }: { targetUserId: number },
    { user }: express.Request,
  ) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    if (!targetUserId || !(await Users.findByPk(targetUserId))) {
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
    }

    return true;
  },
};
