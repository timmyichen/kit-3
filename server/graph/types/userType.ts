import * as express from 'express';
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import {
  Friendships,
  BlockedUsers,
  FriendRequests,
  Deets,
  SharedDeets,
} from 'server/models';
import { timestamps } from './common';
import { User } from 'server/models/types';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { ReqWithLoader } from 'server/lib/loader';

export default new GraphQLObjectType({
  name: 'User',
  description: 'A user of the platform',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (user: any) => user.id,
    },
    fullName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user: User) =>
        user.family_name
          ? user.given_name + ' ' + user.family_name
          : user.given_name,
    },
    username: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user: User) => user.username,
    },
    isFriend: {
      type: new GraphQLNonNull(GraphQLBoolean),
      async resolve(u: User, _: any, { user, loader }: ReqWithLoader) {
        if (!user) {
          return false;
        }

        return !!(await loader(Friendships).loadBy('first_user', u.id, {
          second_user: user.id,
        }));
      },
    },
    isRequested: {
      type: new GraphQLNonNull(GraphQLBoolean),
      async resolve(u: User, _: any, { user, loader }: ReqWithLoader) {
        if (!user) {
          return false;
        }

        return !!(await loader(FriendRequests).loadBy('target_user', u.id, {
          requested_by: user.id,
        }));
      },
    },
    hasRequestedUser: {
      type: new GraphQLNonNull(GraphQLBoolean),
      async resolve(u: User, _: any, { user, loader }: ReqWithLoader) {
        if (!user) {
          return false;
        }

        return !!(await loader(FriendRequests).loadBy('requested_by', u.id, {
          target_user: user.id,
        }));
      },
    },
    isBlocked: {
      type: new GraphQLNonNull(GraphQLBoolean),
      async resolve(u: User, _: any, { user, loader }: ReqWithLoader) {
        if (!user) {
          return false;
        }

        return !!(await loader(BlockedUsers).loadBy('target_user', u.id, {
          blocked_by: user.id,
        }));
      },
    },
    hasAccessToDeet: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        deetId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(
        u: User,
        { deetId }: { deetId: number },
        { user, loader }: ReqWithLoader,
      ) {
        if (!user) {
          throw new AuthenticationError('Must be logged in');
        }

        if (!deetId) {
          throw new UserInputError('Missing id');
        }

        const deet = await loader(Deets).loadBy('id', deetId);

        if (!deet || deet.owner_id !== user.id) {
          throw new UserInputError('Deet not found');
        }

        return !!(await loader(SharedDeets).loadBy('deet_id', deet.id, {
          shared_with: u.id,
        }));
      },
    },
    ...timestamps(),
  }),
});
