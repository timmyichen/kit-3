import { GraphQLList, GraphQLInt, GraphQLNonNull } from 'graphql';
import { AuthenticationError } from 'apollo-server';
import { Op } from 'sequelize';
import { Users, FriendRequests } from 'server/models';
import userType from 'server/graph/types/userType';
import { GraphQLContext } from 'server/routers/graphql';

interface Args {
  count?: number;
}

export default {
  description: 'A users friends',
  type: new GraphQLNonNull(new GraphQLList(userType)),
  args: {
    count: { type: GraphQLInt },
  },
  async resolve(_: any, args: Args, { user }: GraphQLContext) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    const friends = await FriendRequests.findAll({
      where: { target_user: user.id },
    });

    const requesterIds = friends.map(f => f.requested_by);

    const users = await Users.findAll({
      where: {
        id: { [Op.in]: requesterIds },
      },
    });

    return users.slice(0, args.count || 10);
  },
};
