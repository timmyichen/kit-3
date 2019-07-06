import gql from 'graphql-tag';

export const SEARCH_USERS_QUERY = gql`
  query searchUsers(
    $searchQuery: String!
    $count: Int
    $excludeFriends: Boolean
  ) {
    searchUsers(
      searchQuery: $searchQuery
      count: $count
      excludeFriends: $excludeFriends
    ) {
      id
      fullName
      username
      isFriend
      isRequested
      hasRequestedUser
      isBlocked
    }
  }
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
  query friends($searchQuery: String, $count: Int) {
    friends(searchQuery: $searchQuery, count: $count) {
      id
      fullName
      username
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
