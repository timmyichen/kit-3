import userType from 'server/graph/types/userType';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { Users } from 'server/models';

interface Args {
  username: string;
}

export default {
  description: 'The currently authed user',
  type: userType,
  args: {
    username: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve(_1: any, { username }: Args, _2: any) {
    return Users.findOne({ where: { username } });
  },
};
