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
import updateProfilePicture from './updateProfilePicture';
import verifyDeet from './verifyDeet';
import verifyUser from './verifyUser';
import requestVerificationEmail from './requestVerificationEmail';
import inviteUserToKit from './inviteUserToKit';
import requestPasswordReset from './requestPasswordReset';
import setForgottenPassword from './setForgottenPassword';

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
    updateProfilePicture,
    verifyDeet,
    verifyUser,
    requestVerificationEmail,
    inviteUserToKit,
    requestPasswordReset,
    setForgottenPassword,
  }),
});
