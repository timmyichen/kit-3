import { GraphQLObjectType } from 'graphql';
import requestFriend from './requestFriend';
import acceptFriendRequest from './acceptFriendRequest';
import removeFriend from './removeFriend';
import blockUser from './blockUser';
import unblockUser from './unblockUser';
import rescindFriendRequest from './rescindFriendRequest';
import upsertAddress from './upsertAddress';
import upsertEmailAddress from './upsertEmailAddress';
import upsertPhoneNumber from './upsertPhoneNumber';
import deleteContactInfo from './deleteContactInfo';
import updateSharedPermissions from './updateSharedPermissions';

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
    upsertAddress,
    upsertEmailAddress,
    upsertPhoneNumber,
    deleteContactInfo,
    updateSharedPermissions,
  }),
});
