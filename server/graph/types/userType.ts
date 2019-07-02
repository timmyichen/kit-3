import * as express from 'express';
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
} from 'graphql';
import { Friendships, BlockedUsers, FriendRequests } from 'server/models';

export default new GraphQLObjectType({
  name: 'User',
  description: 'A user of the platform',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user: any) => user.id,
    },
    fullName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user: any) =>
        user.family_name
          ? user.given_name + ' ' + user.family_name
          : user.given_name,
    },
    username: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user: any) => user.username,
    },
    isFriend: {
      type: new GraphQLNonNull(GraphQLBoolean),
      async resolve(u: any, _: any, { user }: express.Request) {
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
      async resolve(u: any, _: any, { user }: express.Request) {
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
      async resolve(u: any, _: any, { user }: express.Request) {
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
      async resolve(u: any, _: any, { user }: express.Request) {
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
  }),
});
