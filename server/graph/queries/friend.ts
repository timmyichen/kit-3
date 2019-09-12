import { GraphQLString, GraphQLNonNull } from 'graphql';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { Users, Friendships } from 'server/models';
import friendType from 'server/graph/types/friendType';
import { GraphQLContext } from 'server/routers/graphql';

interface Args {
  username: string;
}

export default {
  description: 'A users friends',
  type: new GraphQLNonNull(friendType),
  args: {
    username: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(_: any, { username }: Args, { user }: GraphQLContext) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    if (!username) {
      throw new UserInputError('Username is required');
    }

    const friend = await Users.findOne({ where: { username } });

    if (!friend) {
      throw new UserInputError('Friend not found');
    }

    const friendship = await Friendships.findOne({
      where: {
        first_user: user.id,
        second_user: friend.id,
      },
    });

    if (!friendship) {
      throw new UserInputError('Friend not found');
    }

    return friend;
  },
};
