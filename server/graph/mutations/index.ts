import { GraphQLObjectType } from 'graphql';
import requestFriend from './requestFriend';
import acceptFriendRequest from './acceptFriendRequest';
import removeFriend from './removeFriend';
import blockUser from './blockUser';
import unblockUser from './unblockUser';
import rescindFriendRequest from './rescindFriendRequest';

export default new GraphQLObjectType({
  name: 'RootMutation',
  // @ts-ignore not sure
  fields: () => ({
    requestFriend,
    acceptFriendRequest,
    removeFriend,
    blockUser,
    unblockUser,
    rescindFriendRequest,
  }),
});
