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
  ContactInfos,
  SharedContactInfos,
} from 'server/models';
import { timestamps } from './common';
import { User } from 'server/models/types';
import { AuthenticationError, UserInputError } from 'apollo-server';

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
      async resolve(u: User, _: any, { user }: express.Request) {
        if (!user) {
          return false;
        }

        return !!(await Friendships.findOne({
          where: {
            first_user: u.id,
            second_user: user.id,
          },
        }));
      },
    },
    isRequested: {
      type: new GraphQLNonNull(GraphQLBoolean),
      async resolve(u: User, _: any, { user }: express.Request) {
        if (!user) {
          return false;
        }

        return !!(await FriendRequests.findOne({
          where: {
            target_user: u.id,
            requested_by: user.id,
          },
        }));
      },
    },
    hasRequestedUser: {
      type: new GraphQLNonNull(GraphQLBoolean),
      async resolve(u: User, _: any, { user }: express.Request) {
        if (!user) {
          return false;
        }

        return !!(await FriendRequests.findOne({
          where: {
            requested_by: u.id,
            target_user: user.id,
          },
        }));
      },
    },
    isBlocked: {
      type: new GraphQLNonNull(GraphQLBoolean),
      async resolve(u: User, _: any, { user }: express.Request) {
        if (!user) {
          return false;
        }

        return !!(await BlockedUsers.findOne({
          where: {
            target_user: u.id,
            blocked_by: user.id,
          },
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
        { user }: express.Request,
      ) {
        if (!user) {
          throw new AuthenticationError('Must be logged in');
        }

        if (!deetId) {
          throw new UserInputError('Missing id');
        }

        const deet = await ContactInfos.findByPk(deetId);

        if (!deet || deet.owner_id !== user.id) {
          throw new UserInputError('Deet not found');
        }

        return !!(await SharedContactInfos.findOne({
          where: { info_id: deet.id, shared_with: u.id },
        }));
      },
    },
    ...timestamps(),
  }),
});
