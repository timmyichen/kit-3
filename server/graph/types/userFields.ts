import {
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
  Images,
  Users,
} from 'server/models';
import { timestamps } from './common';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { ReqWithLoader } from 'server/lib/loader';
import * as express from 'express';

export default {
  id: {
    type: new GraphQLNonNull(GraphQLInt),
    resolve: (user: any) => user.id,
  },
  fullName: {
    type: new GraphQLNonNull(GraphQLString),
    resolve: (user: Users) =>
      user.family_name
        ? user.given_name + ' ' + user.family_name
        : user.given_name,
  },
  givenName: {
    type: new GraphQLNonNull(GraphQLString),
    resolve: (user: Users) => user.given_name,
  },
  familyName: {
    type: new GraphQLNonNull(GraphQLString),
    resolve: (user: Users) => user.family_name,
  },
  email: {
    type: new GraphQLNonNull(GraphQLString),
    resolve: (user: Users, _: any, req: express.Request) => {
      if (req.user && user.id === req.user.id) {
        return req.user.email;
      }

      throw new AuthenticationError('Not allowed');
    },
  },
  profilePicture: {
    type: GraphQLString,
    resolve: async (user: Users, _: any, { loader }: ReqWithLoader) => {
      if (!user.profile_picture_id) {
        return null;
      }

      const image = await loader(Images).loadBy('id', user.profile_picture_id);

      if (image) {
        return image.url;
      }

      return null;
    },
  },
  birthdayDate: {
    type: GraphQLString,
    resolve: async (user: Users, _: any, req: ReqWithLoader) => {
      if (!req.user) {
        return null;
      }

      const isFriend = await req
        .loader(Friendships)
        .loadBy('first_user', user.id, {
          second_user: req.user.id,
        });

      if (isFriend) {
        return user.birthday_date;
      }

      return null;
    },
  },
  birthdayYear: {
    type: GraphQLString,
    resolve: async (user: Users, _: any, req: ReqWithLoader) => {
      if (!req.user) {
        return null;
      }

      const isFriend = await req
        .loader(Friendships)
        .loadBy('first_user', user.id, {
          second_user: req.user.id,
        });

      if (isFriend) {
        return user.birthday_year;
      }

      return null;
    },
  },
  username: {
    type: new GraphQLNonNull(GraphQLString),
    resolve: (user: Users) => user.username,
  },
  isFriend: {
    type: new GraphQLNonNull(GraphQLBoolean),
    async resolve(u: Users, _: any, { user, loader }: ReqWithLoader) {
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
    async resolve(u: Users, _: any, { user, loader }: ReqWithLoader) {
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
    async resolve(u: Users, _: any, { user, loader }: ReqWithLoader) {
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
    async resolve(u: Users, _: any, { user, loader }: ReqWithLoader) {
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
      u: Users,
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
};
