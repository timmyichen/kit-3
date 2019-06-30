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
    _1: any,
    { targetUserId }: { targetUserId: number },
    { user }: express.Request,
  ) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    if (!targetUserId || !(await Users.findByPk(targetUserId))) {
      throw new UserInputError('User not found');
    }

    const ids = [user.id, targetUserId];
    ids.sort();

    const existingFriendship = await Friendships.findOne({
      where: {
        first_user: ids[0],
        second_user: ids[1],
      },
    });

    if (!existingFriendship) {
      throw new UserInputError('Friendship not found');
    }

    await existingFriendship.destroy();

    return true;
  },
};
