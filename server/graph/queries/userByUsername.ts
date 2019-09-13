import userType from 'server/graph/types/userType';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { Users } from 'server/models';

interface Args {
  username: string;
}

export default {
  description: 'Find a user by their username',
  type: userType,
  args: {
    username: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve(_: any, { username }: Args) {
    return Users.findOne({ where: { username } });
  },
};
