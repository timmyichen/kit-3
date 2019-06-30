import * as express from 'express';
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql';
import { AuthenticationError } from 'apollo-server';
import { Users, Friendships } from '../../models';
import userType from '../types/userType';
import { Op } from 'sequelize';

interface Args {
  searchQuery: string;
  count?: number;
  excludeFriends: boolean;
}

export default {
  description: 'Searching for users',
  type: new GraphQLList(userType),
  args: {
    searchQuery: { type: new GraphQLNonNull(GraphQLString) },
    count: { type: GraphQLInt },
    excludeFriends: { type: GraphQLBoolean },
  },
  async resolve(_: any, args: Args, { user }: express.Request) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    let friendIds: Array<number> = [];

    if (args.excludeFriends) {
      const friends = await Friendships.findAll({
        where: { first_user: user.id },
      });

      friendIds = friends.map(f =>
        f.first_user === user.id ? f.second_user : f.first_user,
      );
    }

    const users = await Users.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.iLike]: `${args.searchQuery}%` } },
          { given_name: { [Op.iLike]: `${args.searchQuery}%` } },
          { family_name: { [Op.iLike]: `${args.searchQuery}%` } },
        ],
        id: { [Op.ne]: user.id },
      },
      limit: (args.count || 10) + friendIds.length,
    });

    if (args.excludeFriends) {
      return users.filter(u => !friendIds.includes(u.id));
    } else {
      return users;
    }
  },
};
