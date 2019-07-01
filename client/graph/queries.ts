import gqlTag from 'graphql-tag';

export const searchUsers = gqlTag`
  query searchUsers($searchQuery: String!, $count: Int, $excludeFriends: Boolean) {
    searchUsers(searchQuery: $searchQuery, count: $count, excludeFriends: $excludeFriends) {
      id
      fullName
      username
    }
  }
`;

export const currentUser = gqlTag`
  query currentUser {
    currentUser {
      email
      name
    }
  }
`;
