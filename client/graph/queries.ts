import gql from 'graphql-tag';
import { OTHER_USER_FRAGMENT } from './fragments';

export const SEARCH_USERS_QUERY = gql`
  query searchUsers($searchQuery: String!, $count: Int) {
    searchUsers(searchQuery: $searchQuery, count: $count) {
      ...otherUser
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
    }
  }
`;

export const CURRENT_USER_DEETS_QUERY = gql`
  query currentUserDeets {
    userDeets {
      ... on EmailAddressDeet {
        id
        notes
        label
        owner {
          fullName
          username
        }
        emailAddress
        updatedAt
      }
      ... on PhoneNumberDeet {
        id
        notes
        label
        owner {
          fullName
          username
        }
        number
        countryCode
        updatedAt
      }
      ... on AddressDeet {
        id
        notes
        label
        owner {
          fullName
          username
        }
        addressLine1
        addressLine2
        city
        state
        postalCode
        country
        updatedAt
      }
    }
  }
`;
