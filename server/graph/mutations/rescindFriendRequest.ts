import * as express from 'express';
import { GraphQLBoolean, GraphQLNonNull, GraphQLInt } from 'graphql';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { FriendRequests } from 'server/models';

export default {
  description: 'Rescind a friend request',
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

    if (!targetUserId) {
      throw new UserInputError('Need target');
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

    return true;
  },
};
