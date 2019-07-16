import gql from 'graphql-tag';

export const OTHER_USER_FRAGMENT = gql`
  fragment OtherUser on User {
    id
    fullName
    username
    isFriend
    isRequested
    hasRequestedUser
    isBlocked
    __typename
  }
`;

export const EMAIL_ADDRESS_FRAGMENT = gql`
  fragment EmailAddressFragment on EmailAddressDeet {
    id
    notes
    label
    emailAddress
    updatedAt
    type
    __typename
  }
`;

export const ADDRESS_FRAGMENT = gql`
  fragment AddressFragment on AddressDeet {
    id
    notes
    label
    addressLine1
    addressLine2
    city
    state
    postalCode
    country
    updatedAt
    type
    __typename
  }
`;

export const PHONE_NUMBER_FRAGMENT = gql`
  fragment PhoneNumberFragment on PhoneNumberDeet {
    id
    notes
    label
    phoneNumber
    countryCode
    updatedAt
    type
    __typename
  }
`;
