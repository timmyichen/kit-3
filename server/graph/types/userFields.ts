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
  Images,
  Users,
} from 'server/models';
import { timestamps } from './common';
import { AuthenticationError } from 'apollo-server';
import { getFullName } from 'server/lib/users';
import { GraphQLContext } from 'server/routers/graphql';

export default {
  id: {
    type: new GraphQLNonNull(GraphQLInt),
    resolve: (user: any) => user.id,
  },
  fullName: {
    type: new GraphQLNonNull(GraphQLString),
    resolve: (user: Users) => getFullName(user),
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
    resolve: (user: Users, _: any, req: GraphQLContext) => {
      if (req.user && user.id === req.user.id) {
        return user.email;
      }

      throw new AuthenticationError('Not allowed');
    },
  },
  birthdayDate: {
    type: GraphQLString,
    resolve: (user: Users, _: any, req: GraphQLContext) => {
      if (req.user && user.id === req.user.id) {
        return user.birthday_date;
      }

      throw new AuthenticationError('Not allowed');
    },
  },
  birthdayYear: {
    type: GraphQLString,
    resolve: (user: Users, _: any, req: GraphQLContext) => {
      if (req.user && user.id === req.user.id) {
        return user.birthday_year;
      }

      throw new AuthenticationError('Not allowed');
    },
  },
  profilePicture: {
    type: GraphQLString,
    resolve: async (user: Users, _: any, { loader }: GraphQLContext) => {
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
  isVerified: {
    type: new GraphQLNonNull(GraphQLBoolean),
    resolve: (user: Users) => user.is_verified,
  },
  username: {
    type: new GraphQLNonNull(GraphQLString),
    resolve: (user: Users) => user.username,
  },
  isFriend: {
    type: new GraphQLNonNull(GraphQLBoolean),
    async resolve(u: Users, _: any, { user, loader }: GraphQLContext) {
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
    async resolve(u: Users, _: any, { user, loader }: GraphQLContext) {
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
    async resolve(u: Users, _: any, { user, loader }: GraphQLContext) {
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
    async resolve(u: Users, _: any, { user, loader }: GraphQLContext) {
      if (!user) {
        return false;
      }

      return !!(await loader(BlockedUsers).loadBy('target_user', u.id, {
        blocked_by: user.id,
      }));
    },
  },
  ...timestamps(),
};
