import gqlTag from 'graphql-tag';

export const searchUsersQuery = gqlTag`
  query searchUsers($searchQuery: String!, $count: Int, $excludeFriends: Boolean) {
    searchUsers(searchQuery: $searchQuery, count: $count, excludeFriends: $excludeFriends) {
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

export const currentUserQuery = gqlTag`
  query currentUser {
    currentUser {
      email
      name
    }
  }
`;
