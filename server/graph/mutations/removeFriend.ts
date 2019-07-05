import * as express from 'express';
import { GraphQLBoolean, GraphQLNonNull, GraphQLInt } from 'graphql';
import { Op } from 'sequelize';
import {
  AuthenticationError,
  UserInputError,
  ApolloError,
} from 'apollo-server';
import {
  Friendships,
  Users,
  SharedContactInfos,
  ContactInfos,
} from 'server/models';
import { db } from 'server/lib/db';

export default {
  description: 'Remove a friend',
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

    const existingFriendship = await Friendships.findOne({
      where: {
        first_user: user.id,
        second_user: targetUserId,
      },
    });

    if (!existingFriendship) {
      throw new UserInputError('Friendship not found');
    }

    let sharedInfos = await SharedContactInfos.findAll({
      where: {
        [Op.or]: [{ shared_with: user.id }, { shared_with: targetUserId }],
      },
      include: [ContactInfos],
    });

    sharedInfos = sharedInfos.filter(
      i =>
        (i.info.owner_id === targetUserId && i.shared_with === user.id) ||
        (i.info.owner_id === user.id && i.shared_with === targetUserId),
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

        if (sharedInfos.length) {
          promises.concat(sharedInfos.map(i => i.destroy({ transaction })));
        }

        await Promise.all(promises);
      });
    } catch (e) {
      throw new ApolloError(e.message);
    }

    return true;
  },
};
