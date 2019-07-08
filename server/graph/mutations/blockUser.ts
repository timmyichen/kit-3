import * as express from 'express';
import { GraphQLBoolean, GraphQLNonNull, GraphQLInt } from 'graphql';
import { AuthenticationError, UserInputError } from 'apollo-server';
import {
  Friendships,
  FriendRequests,
  BlockedUsers,
  Users,
  SharedDeets,
  Deets,
} from 'server/models';
import { db } from 'server/lib/db';
import { Op } from 'sequelize';

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

    let sharedDeets = await SharedDeets.findAll({
      where: {
        [Op.or]: [{ shared_with: user.id }, { shared_with: targetUserId }],
      },
      include: [Deets],
    });

    sharedDeets = sharedDeets.filter(
      i =>
        (i.deet.owner_id === targetUserId && i.shared_with === user.id) ||
        (i.deet.owner_id === user.id && i.shared_with === targetUserId),
    );

    await db.transaction(async (transaction: any) => {
      const promises: Array<Promise<any>> = [
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
      ];

      if (sharedDeets.length) {
        promises.concat(sharedDeets.map(i => i.destroy({ transaction })));
      }

      await Promise.all([promises]);
    });

    return true;
  },
};
