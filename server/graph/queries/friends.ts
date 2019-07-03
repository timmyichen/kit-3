import * as express from 'express';
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql';
import { AuthenticationError } from 'apollo-server';
import { Op } from 'sequelize';
import { Users, Friendships } from 'server/models';
import userType from 'server/graph/types/userType';

interface Args {
  searchQuery: string;
  count?: number;
  excludeFriends: boolean;
}

export default {
  description: 'A users friends',
  type: new GraphQLList(userType),
  args: {
    searchQuery: { type: new GraphQLNonNull(GraphQLString) },
    count: { type: GraphQLInt },
  },
  async resolve(_: any, args: Args, { user }: express.Request) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    const friends = await Friendships.findAll({
      where: { first_user: user.id },
    });

    const friendIds = friends.map(f =>
      f.first_user === user.id ? f.second_user : f.first_user,
    );

    const users = await Users.findAll({
      where: {
        id: { [Op.in]: friendIds },
      },
    });

    if (!args.searchQuery) {
      return users.slice(0, args.count || 10);
    }

    return users.filter(
      u =>
        u.given_name.includes(args.searchQuery) ||
        u.family_name.includes(args.searchQuery) ||
        u.username.includes(args.searchQuery),
    );
  },
};
