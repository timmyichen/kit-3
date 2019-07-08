import gql from 'graphql-tag';

export const REQUEST_FRIEND_MUTATION = gql`
  mutation requestFriend($targetUserId: Int!) {
    requestFriend(targetUserId: $targetUserId)
  }
`;

export const REMOVE_FRIEND_MUTATION = gql`
  mutation removeFriend($targetUserId: Int!) {
    removeFriend(targetUserId: $targetUserId)
  }
`;

export const BLOCK_USER_MUTATION = gql`
  mutation blockUser($targetUserId: Int!) {
    blockUser(targetUserId: $targetUserId)
  }
`;

export const UNBLOCK_USER_MUTATION = gql`
  mutation unblockUser($targetUserId: Int!) {
    unblockUser(targetUserId: $targetUserId)
  }
`;

export const RESCIND_REQUEST_MUTATION = gql`
  mutation rescindFriendRequest($targetUserId: Int!) {
    rescindFriendRequest(targetUserId: $targetUserId)
  }
`;

export const ACCEPT_REQUEST_MUTATION = gql`
  mutation acceptFriendRequest($targetUserId: Int!) {
    acceptFriendRequest(targetUserId: $targetUserId)
  }
`;

export const UPSERT_ADDRESS_MUTATION = gql`
  mutation upsertAddress(
    $infoId: Int
    $notes: String
    $label: String!
    $addressLine1: String!
    $addressLine2: String
    $city: String
    $state: String
    $postalCode: String
    $countryCode: String!
  ) {
    upsertAddress(
      infoId: $infoId
      notes: $notes
      label: $label
      addressLine1: $addressLine1
      addressLine2: $addressLine2
      city: $city
      state: $state
      postalCode: $postalCode
      countryCode: $countryCode
    ) {
      id
      addressLine1
      addressLine2
      notes
      label
      city
      state
      postalCode
      countryCode
      createdAt
      updatedAt
    }
  }
`;

export const UPSERT_PHONE_NUMBER_MUTATION = gql`
  mutation upsertPhoneNumber(
    $infoId: Int
    $notes: String
    $label: String!
    $phoneNumber: String!
    $countryCode: String
  ) {
    upsertPhoneNumber(
      infoId: $infoId
      notes: $notes
      label: $label
      phoneNumber: $phoneNumber
      countryCode: $countryCode
    ) {
      id
      notes
      label
      number
      countryCode
      createdAt
      updatedAt
    }
  }
`;

export const UPSERT_EMAIL_ADDRESS_MUTATION = gql`
  mutation upsertEmailAddress(
    $infoId: Int
    $notes: String
    $label: String!
    $emailAddress: String!
  ) {
    upsertEmailAddress(
      infoId: $infoId
      notes: $notes
      label: $label
      emailAddress: $emailAddress
    ) {
      id
      notes
      label
      emailAddress
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_SHARED_PERMISSIONS_MUTATION = gql`
  mutation updateSharedPermissions(
    $infoId: Int!
    $userIdsToAdd: [Int]!
    $userIdsToRemove: [Int]!
  ) {
    updateSharedPermissions(
      infoId: $infoId
      userIdsToAdd: $userIdsToAdd
      userIdsToRemove: $userIdsToRemove
    )
  }
`;
