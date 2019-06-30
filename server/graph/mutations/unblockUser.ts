import * as express from 'express';
import { GraphQLBoolean, GraphQLNonNull, GraphQLInt } from 'graphql';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { BlockedUsers, Users } from '../../models';

export default {
  description: 'Unblock a user',
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

    const existingBlock = await BlockedUsers.findOne({
      where: {
        blocked_by: user.id,
        target_user: targetUserId,
      },
    });

    if (!existingBlock) {
      throw new UserInputError('User isnt blocked');
    }

    await existingBlock.destroy();

    return true;
  },
};
