import * as express from 'express';
import { GraphQLBoolean, GraphQLNonNull, GraphQLInt } from 'graphql';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { FriendRequests, Friendships } from '../../models';
import { db } from '../../lib/db';

export default {
  description: 'Accept a friend request',
  type: GraphQLBoolean,
  args: {
    requesterId: { type: new GraphQLNonNull(GraphQLInt) },
  },
  async resolve(
    _: any,
    { requesterId }: { requesterId: number },
    { user }: express.Request,
  ) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    if (!requesterId) {
      throw new UserInputError('Missing requester ID');
    }

    const existingRequest = await FriendRequests.findOne({
      where: {
        target_user: user.id,
        requested_by: requesterId,
      },
    });

    if (!existingRequest) {
      throw new UserInputError('Request not found');
    }

    await db.transaction((transaction: any) =>
      Promise.all([
        existingRequest.destroy({ transaction }),
        Friendships.create(
          {
            first_user: user.id,
            second_user: requesterId,
          },
          { transaction },
        ),
        Friendships.create(
          {
            first_user: requesterId,
            second_user: user.id,
          },
          { transaction },
        ),
      ]),
    );

    return true;
  },
};
