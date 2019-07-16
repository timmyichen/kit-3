import gql from 'graphql-tag';
import {
  EMAIL_ADDRESS_FRAGMENT,
  ADDRESS_FRAGMENT,
  PHONE_NUMBER_FRAGMENT,
} from './fragments';

export const REQUEST_FRIEND_MUTATION = gql`
  mutation requestFriend($targetUserId: Int!) {
    requestFriend(targetUserId: $targetUserId) {
      id
      __typename
    }
  }
`;

export const REMOVE_FRIEND_MUTATION = gql`
  mutation removeFriend($targetUserId: Int!) {
    removeFriend(targetUserId: $targetUserId) {
      id
      __typename
    }
  }
`;

export const BLOCK_USER_MUTATION = gql`
  mutation blockUser($targetUserId: Int!) {
    blockUser(targetUserId: $targetUserId) {
      id
      __typename
    }
  }
`;

export const UNBLOCK_USER_MUTATION = gql`
  mutation unblockUser($targetUserId: Int!) {
    unblockUser(targetUserId: $targetUserId) {
      id
      __typename
    }
  }
`;

export const RESCIND_REQUEST_MUTATION = gql`
  mutation rescindFriendRequest($targetUserId: Int!) {
    rescindFriendRequest(targetUserId: $targetUserId) {
      id
      __typename
    }
  }
`;

export const ACCEPT_REQUEST_MUTATION = gql`
  mutation acceptFriendRequest($targetUserId: Int!) {
    acceptFriendRequest(targetUserId: $targetUserId) {
      id
      fullName
      username
      __typename
    }
  }
`;

export const UPSERT_ADDRESS_MUTATION = gql`
  mutation upsertAddress(
    $deetId: Int
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
      deetId: $deetId
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
      country
      updatedAt
      type
      __typename
    }
  }
`;

export const UPSERT_PHONE_NUMBER_MUTATION = gql`
  mutation upsertPhoneNumber(
    $deetId: Int
    $notes: String
    $label: String!
    $phoneNumber: String!
    $countryCode: String
  ) {
    upsertPhoneNumber(
      deetId: $deetId
      notes: $notes
      label: $label
      phoneNumber: $phoneNumber
      countryCode: $countryCode
    ) {
      id
      notes
      label
      phoneNumber
      countryCode
      updatedAt
      type
      __typename
    }
  }
`;

export const UPSERT_EMAIL_ADDRESS_MUTATION = gql`
  mutation upsertEmailAddress(
    $deetId: Int
    $notes: String
    $label: String!
    $emailAddress: String!
  ) {
    upsertEmailAddress(
      deetId: $deetId
      notes: $notes
      label: $label
      emailAddress: $emailAddress
    ) {
      id
      notes
      label
      emailAddress
      updatedAt
      type
      __typename
    }
  }
`;

export const UPDATE_SHARED_PERMISSIONS_MUTATION = gql`
  mutation updateSharedPermissions(
    $deetId: Int!
    $userIdsToAdd: [Int]!
    $userIdsToRemove: [Int]!
  ) {
    updateSharedPermissions(
      deetId: $deetId
      userIdsToAdd: $userIdsToAdd
      userIdsToRemove: $userIdsToRemove
    )
  }
`;

export const DELETE_DEET_MUTATION = gql`
  mutation deleteDeet($deetId: Int!) {
    deleteDeet(deetId: $deetId) {
      ...EmailAddressFragment
      ...AddressFragment
      ...PhoneNumberFragment
    }
  }
  ${EMAIL_ADDRESS_FRAGMENT}
  ${ADDRESS_FRAGMENT}
  ${PHONE_NUMBER_FRAGMENT}
`;
