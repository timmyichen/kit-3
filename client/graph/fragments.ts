import gql from 'graphql-tag';

export const OTHER_USER_FRAGMENT = gql`
  fragment otherUser on User {
    id
    fullName
    username
    isFriend
    isRequested
    hasRequestedUser
    isBlocked
  }
`;
