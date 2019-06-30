import { GraphQLObjectType } from 'graphql';
import requestFriend from './requestFriend';
import acceptFriendRequest from './acceptFriendRequest';
import removeFriend from './removeFriend';

export default new GraphQLObjectType({
  name: 'RootMutation',
  // @ts-ignore not sure
  fields: () => ({
    requestFriend,
    acceptFriendRequest,
    removeFriend,
  }),
});
