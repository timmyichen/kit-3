import * as express from 'express';
import { GraphQLNonNull, GraphQLInt } from 'graphql';
import { Op } from 'sequelize';
import {
  AuthenticationError,
  UserInputError,
  ApolloError,
} from 'apollo-server';
import { Friendships, Users, SharedDeets, Deets } from 'server/models';
import { db } from 'server/lib/db';
import userType from '../types/userType';

export default {
  description: 'Remove a friend',
  type: GraphQLNonNull(userType),
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

    if (!targetUserId) {
      throw new UserInputError('Cannot find user');
    }

    const targetUser = await Users.findByPk(targetUserId);

    if (!targetUser) {
      throw new UserInputError('Cannot find user');
    }

    const existingFriendship = await Friendships.findOne({
      where: {
        first_user: user.id,
        second_user: targetUserId,
      },
    });

    if (!existingFriendship) {
      throw new UserInputError('Friendship not found');
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

    try {
      await db.transaction(async (transaction: any) => {
        const promises: Array<Promise<any>> = [
          Friendships.destroy({
            where: {
              [Op.or]: [
                { first_user: user.id, second_user: targetUserId },
                { second_user: user.id, first_user: targetUserId },
              ],
            },
            transaction,
          }),
        ];

        if (sharedDeets.length) {
          promises.concat(sharedDeets.map(i => i.destroy({ transaction })));
        }

        await Promise.all(promises);
      });
    } catch (e) {
      throw new ApolloError(e.message);
    }

    return targetUser;
  },
};
