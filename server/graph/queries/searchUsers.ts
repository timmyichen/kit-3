import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} from 'graphql';
import { AuthenticationError } from 'apollo-server';
import { Op } from 'sequelize';
import { Users } from 'server/models';
import userType from 'server/graph/types/userType';
import { ReqWithLoader } from 'server/lib/loader';

interface Args {
  searchQuery: string;
  count?: number;
}

export default {
  description: 'Searching for users',
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
  args: {
    searchQuery: { type: new GraphQLNonNull(GraphQLString) },
    count: { type: GraphQLInt },
  },
  async resolve(_: any, args: Args, { user }: ReqWithLoader) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    if (args.searchQuery === '') {
      return [];
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
      limit: args.count || 10,
    });

    return users;
  },
};
