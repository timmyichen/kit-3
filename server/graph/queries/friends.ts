import * as express from 'express';
import { GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql';
import { AuthenticationError } from 'apollo-server';
import { Op } from 'sequelize';
import { Users, Friendships } from 'server/models';
import userType from 'server/graph/types/userType';
import paginationType from './lib/paginationType';
import paginate from './lib/paginate';

interface Args {
  after?: string;
  searchQuery?: string;
  count?: number;
}

export default {
  description: 'A users friends',
  type: new GraphQLNonNull(paginationType({ name: 'Friends', type: userType })),
  args: {
    after: { type: GraphQLString },
    searchQuery: { type: GraphQLString },
    count: { type: GraphQLInt },
  },
  async resolve(_: any, args: Args, { user }: express.Request) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    const count = Math.min(args.count || 10, 30);

    const friends = await Friendships.findAll({
      where: { first_user: user.id },
    });

    const friendIds = friends.map(f =>
      f.first_user === user.id ? f.second_user : f.first_user,
    );

    const where: any = {
      id: { [Op.in]: friendIds },
    };

    if (args.after) {
      where.updated_at = {
        [Op.lte]: new Date(parseInt(args.after, 10)).toISOString(),
      };
    }

    if (args.searchQuery) {
      const searchQuery = args.searchQuery.toLowerCase().replace(/%/, '');
      where[Op.or] = [
        { given_name: { [Op.iLike]: `${searchQuery}%` } },
        { family_name: { [Op.iLike]: `${searchQuery}%` } },
        { username: { [Op.iLike]: `${searchQuery}%` } },
      ];
    }

    return await paginate({
      model: Users,
      where,
      count,
    });
  },
};
