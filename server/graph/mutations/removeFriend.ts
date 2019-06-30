import * as express from 'express';
import { GraphQLBoolean, GraphQLNonNull, GraphQLInt } from 'graphql';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { Friendships, Users } from '../../models';

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

    await Friendships.destroy({
      where: {
        $or: [
          { first_user: user.id, second_user: targetUserId },
          { second_user: user.id, first_user: targetUserId },
        ],
      },
    });

    return true;
  },
};
