import * as express from 'express';
import { GraphQLBoolean, GraphQLNonNull, GraphQLInt } from 'graphql';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { Friendships, FriendRequests, BlockedUsers, Users } from '../../models';
import { db } from '../../lib/db';

export default {
  description: 'Block a user',
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
      throw new UserInputError('User not found');
    }

    await db.transaction(async (transaction: any) =>
      Promise.all([
        Friendships.destroy({
          where: {
            first_user: user.id,
            second_user: targetUserId,
          },
          transaction,
        }),
        Friendships.destroy({
          where: {
            first_user: targetUserId,
            second_user: user.id,
          },
          transaction,
        }),
        FriendRequests.destroy({
          where: {
            target_user: user.id,
            requested_by: targetUserId,
          },
          transaction,
        }),
        FriendRequests.destroy({
          where: {
            requested_by: user.id,
            target_user: targetUserId,
          },
          transaction,
        }),
        BlockedUsers.upsert(
          {
            target_user: targetUserId,
            blocked_by: user.id,
          },
          { transaction },
        ),
      ]),
    );

    return true;
  },
};
