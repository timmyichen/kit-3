import { GraphQLNonNull, GraphQLInt } from 'graphql';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { FriendRequests, Users } from 'server/models';
import userType from '../types/userType';
import { GraphQLContext } from 'server/routers/graphql';

export default {
  description: 'Rescind a friend request',
  type: GraphQLNonNull(userType),
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

    const existingRequest = await FriendRequests.findOne({
      where: {
        target_user: targetUserId,
        requested_by: user.id,
      },
    });

    if (!existingRequest) {
      throw new UserInputError('Request not found');
    }

    await existingRequest.destroy();

    return targetUser;
  },
};
