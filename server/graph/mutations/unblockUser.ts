import { GraphQLNonNull, GraphQLInt } from 'graphql';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { BlockedUsers, Users } from 'server/models';
import userType from '../types/userType';
import { GraphQLContext } from 'server/routers/graphql';

export default {
  description: 'Unblock a user',
  type: new GraphQLNonNull(userType),
  args: {
    targetUserId: { type: new GraphQLNonNull(GraphQLInt) },
  },
  async resolve(
    _: any,
    { targetUserId }: { targetUserId: number },
    { user }: GraphQLContext,
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

    return targetUser;
  },
};
