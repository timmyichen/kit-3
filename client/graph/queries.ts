import gql from 'graphql-tag';
import {
  OTHER_USER_FRAGMENT,
  EMAIL_ADDRESS_FRAGMENT,
  ADDRESS_FRAGMENT,
  PHONE_NUMBER_FRAGMENT,
} from './fragments';

export const SEARCH_USERS_QUERY = gql`
  query searchUsers($searchQuery: String!, $count: Int) {
    searchUsers(searchQuery: $searchQuery, count: $count) {
      ...OtherUser
    }
  }
  ${OTHER_USER_FRAGMENT}
`;

export const CURRENT_USER_QUERY = gql`
  query currentUser {
    currentUser {
      email
      name
    }
  }
`;

export const FRIENDS_QUERY = gql`
  query friends($searchQuery: String, $count: Int, $after: String) {
    friends(searchQuery: $searchQuery, count: $count, after: $after) {
      items {
        id
        fullName
        username
      }
      pageInfo {
        hasNext
        nextCursor
      }
    }
  }
`;

export const DEET_PERMISSIONS_QUERY = gql`
  query deetPerms(
    $searchQuery: String
    $count: Int
    $after: String
    $deetId: Int!
  ) {
    friends(searchQuery: $searchQuery, count: $count, after: $after) {
      items {
        id
        fullName
        username
        hasAccessToDeet(deetId: $deetId)
      }
      pageInfo {
        hasNext
        nextCursor
      }
    }
  }
`;

export const PENDING_FRIEND_REQUESTS_QUERY = gql`
  query pendingFriendRequests($count: Int) {
    pendingFriendRequests(count: $count) {
      id
      fullName
      username
      __typename
    }
  }
`;

export const CURRENT_USER_DEETS_QUERY = gql`
  query currentUserDeets {
    userDeets {
      ...EmailAddressFragment
      ...AddressFragment
      ...PhoneNumberFragment
    }
  }
  ${EMAIL_ADDRESS_FRAGMENT}
  ${ADDRESS_FRAGMENT}
  ${PHONE_NUMBER_FRAGMENT}
`;

export const ACCESSIBLE_DEETS_QUERY = gql`
  query accessibleDeets($type: String, $after: String, $count: Int) {
    accessibleDeets(type: $type, count: $count, after: $after) {
      items {
        ...EmailAddressFragment
        ... on EmailAddressDeet {
          owner {
            fullName
            username
          }
        }
        ...AddressFragment
        ... on AddressDeet {
          owner {
            fullName
            username
          }
        }
        ...PhoneNumberFragment
        ... on PhoneNumberDeet {
          owner {
            fullName
            username
          }
        }
      }
      pageInfo {
        hasNext
        nextCursor
      }
    }
  }
  ${EMAIL_ADDRESS_FRAGMENT}
  ${ADDRESS_FRAGMENT}
  ${PHONE_NUMBER_FRAGMENT}
`;
