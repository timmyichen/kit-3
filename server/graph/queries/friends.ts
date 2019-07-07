import * as express from 'express';
import { GraphQLList, GraphQLString, GraphQLInt } from 'graphql';
import { AuthenticationError } from 'apollo-server';
import { Op } from 'sequelize';
import { Users, Friendships } from 'server/models';
import userType from 'server/graph/types/userType';

interface Args {
  searchQuery?: string;
  count?: number;
}

export default {
  description: 'A users friends',
  type: new GraphQLList(userType),
  args: {
    searchQuery: { type: GraphQLString },
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

    const searchQuery = args.searchQuery || '';

    return users.filter(
      u =>
        u.given_name.includes(searchQuery) ||
        u.family_name.includes(searchQuery) ||
        u.username.includes(searchQuery),
    );
  },
};
