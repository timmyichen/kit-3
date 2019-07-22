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
import deleteDeet from './deleteDeet';
import updateSharedPermissions from './updateSharedPermissions';
import updateUser from './updateUser';
import updatePassword from './updatePassword';

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
    deleteDeet,
    updateSharedPermissions,
    updateUser,
    updatePassword,
  }),
});
