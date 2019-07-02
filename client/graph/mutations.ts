import gqlTag from 'graphql-tag';

export const REQUEST_FRIEND_MUTATION = gqlTag`
  mutation requestFriend($targetUserId: Int!) {
    requestFriend(targetUserId: $targetUserId)
  }
`;

export const REMOVE_FRIEND_MUTATION = gqlTag`
  mutation removeFriend($targetUserId: Int!) {
    removeFriend(targetUserId: $targetUserId)
  }
`;

export const BLOCK_USER_MUTATION = gqlTag`
  mutation blockUser($targetUserId: Int!) {
    blockUser(targetUserId: $targetUserId)
  }
`;

export const UNBLOCK_USER_MUTATION = gqlTag`
  mutation unblockUser($targetUserId: Int!) {
    unblockUser(targetUserId: $targetUserId)
  }
`;

export const RESCIND_REQUEST_MUTATION = gqlTag`
  mutation rescindFriendRequest($targetUserId: Int!) {
    rescindFriendRequest(targetUserId: $targetUserId)
  }
`;

export const ACCEPT_REQUEST_MUTATION = gqlTag`
  mutation acceptFriendRequest($targetUserId: Int!) {
    acceptFriendRequest(targetUserId: $targetUserId)
  }
`;
