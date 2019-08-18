import gql from 'graphql-tag';
import * as ReactApollo from 'react-apollo';
import * as React from 'react';
import * as ReactApolloHooks from 'react-apollo-hooks';
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

/** A physical address deet */
export type AddressDeet = {
  __typename?: 'AddressDeet';
  id: Scalars['Int'];
  owner: User;
  addressLine1: Scalars['String'];
  addressLine2: Scalars['String'];
  city: Scalars['String'];
  state: Scalars['String'];
  postalCode: Scalars['String'];
  country: Scalars['String'];
  label: Scalars['String'];
  notes: Scalars['String'];
  type: DeetType;
  isPrimary: Scalars['Boolean'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

/** A user of the platform */
export type BirthdayUser = {
  __typename?: 'BirthdayUser';
  id: Scalars['Int'];
  fullName: Scalars['String'];
  givenName: Scalars['String'];
  familyName: Scalars['String'];
  email: Scalars['String'];
  birthdayDate?: Maybe<Scalars['String']>;
  birthdayYear?: Maybe<Scalars['String']>;
  username: Scalars['String'];
  isFriend: Scalars['Boolean'];
  isRequested: Scalars['Boolean'];
  hasRequestedUser: Scalars['Boolean'];
  isBlocked: Scalars['Boolean'];
  hasAccessToDeet: Scalars['Boolean'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  birthday: Scalars['String'];
};

/** A user of the platform */
export type BirthdayUserHasAccessToDeetArgs = {
  deetId: Scalars['Int'];
};

export type Deet = EmailAddressDeet | PhoneNumberDeet | AddressDeet;

export enum DeetType {
  Address = 'address',
  EmailAddress = 'email_address',
  PhoneNumber = 'phone_number',
}

/** An email addressdeet */
export type EmailAddressDeet = {
  __typename?: 'EmailAddressDeet';
  id: Scalars['Int'];
  owner: User;
  emailAddress: Scalars['String'];
  label: Scalars['String'];
  notes: Scalars['String'];
  type: DeetType;
  isPrimary: Scalars['Boolean'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

/** Pagination for Friends */
export type FriendsPagination = {
  __typename?: 'FriendsPagination';
  items: Array<User>;
  pageInfo: PaginationInfo;
};

export type PaginationInfo = {
  __typename?: 'PaginationInfo';
  hasNext: Scalars['Boolean'];
  nextCursor?: Maybe<Scalars['String']>;
};

/** A phone number deet */
export type PhoneNumberDeet = {
  __typename?: 'PhoneNumberDeet';
  id: Scalars['Int'];
  owner: User;
  countryCode: Scalars['String'];
  phoneNumber: Scalars['String'];
  label: Scalars['String'];
  notes: Scalars['String'];
  type: DeetType;
  isPrimary: Scalars['Boolean'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type RootMutation = {
  __typename?: 'RootMutation';
  /** Request a user to be your friend */
  requestFriend: User;
  /** Accept a friend request */
  acceptFriendRequest: User;
  /** Remove a friend */
  removeFriend: User;
  /** Block a user */
  blockUser: User;
  /** Unblock a user */
  unblockUser: User;
  /** Rescind a friend request */
  rescindFriendRequest: User;
  /** Upsert an address record */
  upsertAddress: AddressDeet;
  /** Upsert a phone number record */
  upsertEmailAddress: EmailAddressDeet;
  /** Upsert a phone number record */
  upsertPhoneNumber: PhoneNumberDeet;
  /** Upsert a phone number record */
  deleteDeet: Deet;
  /** Update permissions for shared */
  updateSharedPermissions?: Maybe<Array<Maybe<User>>>;
  /** Update the currently authed user */
  updateUser: User;
  /** Update the users password */
  updatePassword: Scalars['Boolean'];
};

export type RootMutationRequestFriendArgs = {
  targetUserId: Scalars['Int'];
};

export type RootMutationAcceptFriendRequestArgs = {
  targetUserId: Scalars['Int'];
};

export type RootMutationRemoveFriendArgs = {
  targetUserId: Scalars['Int'];
};

export type RootMutationBlockUserArgs = {
  targetUserId: Scalars['Int'];
};

export type RootMutationUnblockUserArgs = {
  targetUserId: Scalars['Int'];
};

export type RootMutationRescindFriendRequestArgs = {
  targetUserId: Scalars['Int'];
};

export type RootMutationUpsertAddressArgs = {
  deetId?: Maybe<Scalars['Int']>;
  notes: Scalars['String'];
  label: Scalars['String'];
  addressLine1: Scalars['String'];
  addressLine2: Scalars['String'];
  city: Scalars['String'];
  state: Scalars['String'];
  postalCode: Scalars['String'];
  countryCode: Scalars['String'];
  isPrimary: Scalars['Boolean'];
};

export type RootMutationUpsertEmailAddressArgs = {
  deetId?: Maybe<Scalars['Int']>;
  notes: Scalars['String'];
  label: Scalars['String'];
  emailAddress: Scalars['String'];
  isPrimary: Scalars['Boolean'];
};

export type RootMutationUpsertPhoneNumberArgs = {
  deetId?: Maybe<Scalars['Int']>;
  notes: Scalars['String'];
  label: Scalars['String'];
  phoneNumber: Scalars['String'];
  countryCode: Scalars['String'];
  isPrimary: Scalars['Boolean'];
};

export type RootMutationDeleteDeetArgs = {
  deetId: Scalars['Int'];
};

export type RootMutationUpdateSharedPermissionsArgs = {
  deetId: Scalars['Int'];
  userIdsToAdd?: Maybe<Array<Maybe<Scalars['Int']>>>;
  userIdsToRemove?: Maybe<Array<Maybe<Scalars['Int']>>>;
};

export type RootMutationUpdateUserArgs = {
  passwordVerification: Scalars['String'];
  email: Scalars['String'];
  givenName: Scalars['String'];
  familyName: Scalars['String'];
  birthday?: Maybe<Scalars['String']>;
};

export type RootMutationUpdatePasswordArgs = {
  passwordVerification: Scalars['String'];
  newPassword: Scalars['String'];
};

export type RootQuery = {
  __typename?: 'RootQuery';
  /** The currently authed user */
  currentUser?: Maybe<User>;
  /** Searching for users */
  searchUsers: Array<Maybe<User>>;
  /** The currently authed user */
  userByUsername?: Maybe<User>;
  /** A users friends */
  friends: FriendsPagination;
  /** Get all deets owned by a user */
  userDeets: Array<Deet>;
  /** Deets accessible to the currently authed user */
  accessibleDeets: SharedDeetsPagination;
  /** A users friends */
  pendingFriendRequests: Array<Maybe<User>>;
  /** Get all of a users todos */
  userTodos: UserTodos;
  /** Get all users with upcoming birthdays */
  upcomingBirthdays: Array<BirthdayUser>;
};

export type RootQuerySearchUsersArgs = {
  searchQuery: Scalars['String'];
  count?: Maybe<Scalars['Int']>;
};

export type RootQueryUserByUsernameArgs = {
  username: Scalars['String'];
};

export type RootQueryFriendsArgs = {
  after?: Maybe<Scalars['String']>;
  searchQuery?: Maybe<Scalars['String']>;
  count?: Maybe<Scalars['Int']>;
};

export type RootQueryAccessibleDeetsArgs = {
  type?: Maybe<Scalars['String']>;
  count?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
};

export type RootQueryPendingFriendRequestsArgs = {
  count?: Maybe<Scalars['Int']>;
};

export type RootQueryUpcomingBirthdaysArgs = {
  days?: Maybe<Scalars['Int']>;
};

/** Pagination for SharedDeets */
export type SharedDeetsPagination = {
  __typename?: 'SharedDeetsPagination';
  items: Array<Deet>;
  pageInfo: PaginationInfo;
};

/** A user of the platform */
export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  fullName: Scalars['String'];
  givenName: Scalars['String'];
  familyName: Scalars['String'];
  email: Scalars['String'];
  birthdayDate?: Maybe<Scalars['String']>;
  birthdayYear?: Maybe<Scalars['String']>;
  username: Scalars['String'];
  isFriend: Scalars['Boolean'];
  isRequested: Scalars['Boolean'];
  hasRequestedUser: Scalars['Boolean'];
  isBlocked: Scalars['Boolean'];
  hasAccessToDeet: Scalars['Boolean'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

/** A user of the platform */
export type UserHasAccessToDeetArgs = {
  deetId: Scalars['Int'];
};

/** A phone number deet */
export type UserTodos = {
  __typename?: 'UserTodos';
  hasFriends: Scalars['Boolean'];
  hasDeets: Scalars['Boolean'];
  hasPrimaryAddress: Scalars['Boolean'];
  hasPrimaryPhoneNumber: Scalars['Boolean'];
  hasPrimaryEmailAddress: Scalars['Boolean'];
};
export type AcceptFriendRequestMutationVariables = {
  targetUserId: Scalars['Int'];
};

export type AcceptFriendRequestMutation = { __typename?: 'RootMutation' } & {
  acceptFriendRequest: { __typename?: 'User' } & OtherUserFragment;
};

export type AccessibleDeetsQueryVariables = {
  type?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  count?: Maybe<Scalars['Int']>;
};

export type AccessibleDeetsQuery = { __typename?: 'RootQuery' } & {
  accessibleDeets: { __typename?: 'SharedDeetsPagination' } & {
    items: Array<
      | ({ __typename?: 'EmailAddressDeet' } & {
          owner: { __typename?: 'User' } & BaseUserFragment;
        } & EmailAddressFragment)
      | ({ __typename?: 'AddressDeet' } & {
          owner: { __typename?: 'User' } & BaseUserFragment;
        } & AddressFragment)
      | ({ __typename?: 'PhoneNumberDeet' } & {
          owner: { __typename?: 'User' } & BaseUserFragment;
        } & PhoneNumberFragment)
    >;
    pageInfo: { __typename?: 'PaginationInfo' } & Pick<
      PaginationInfo,
      'hasNext' | 'nextCursor'
    >;
  };
};

export type AddressFragment = { __typename: 'AddressDeet' } & Pick<
  AddressDeet,
  | 'id'
  | 'notes'
  | 'label'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'state'
  | 'postalCode'
  | 'country'
  | 'updatedAt'
  | 'type'
  | 'isPrimary'
>;

export type BaseUserFragment = { __typename: 'User' } & Pick<
  User,
  'id' | 'username' | 'fullName'
>;

export type BlockUserMutationVariables = {
  targetUserId: Scalars['Int'];
};

export type BlockUserMutation = { __typename?: 'RootMutation' } & {
  blockUser: { __typename?: 'User' } & OtherUserFragment;
};

export type CurrentUserDeetsQueryVariables = {};

export type CurrentUserDeetsQuery = { __typename?: 'RootQuery' } & {
  userDeets: Array<
    EmailAddressFragment | AddressFragment | PhoneNumberFragment
  >;
};

export type CurrentUserFragment = { __typename: 'User' } & Pick<
  User,
  | 'id'
  | 'username'
  | 'givenName'
  | 'familyName'
  | 'email'
  | 'birthdayDate'
  | 'birthdayYear'
>;

export type DeetPermsQueryVariables = {
  searchQuery?: Maybe<Scalars['String']>;
  count?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  deetId: Scalars['Int'];
};

export type DeetPermsQuery = { __typename?: 'RootQuery' } & {
  friends: { __typename?: 'FriendsPagination' } & {
    items: Array<{ __typename?: 'User' } & UserAccessFragment>;
    pageInfo: { __typename?: 'PaginationInfo' } & Pick<
      PaginationInfo,
      'hasNext' | 'nextCursor'
    >;
  };
};

export type DeleteDeetMutationVariables = {
  deetId: Scalars['Int'];
};

export type DeleteDeetMutation = { __typename?: 'RootMutation' } & {
  deleteDeet: EmailAddressFragment | AddressFragment | PhoneNumberFragment;
};

export type EmailAddressFragment = { __typename: 'EmailAddressDeet' } & Pick<
  EmailAddressDeet,
  'id' | 'notes' | 'label' | 'emailAddress' | 'updatedAt' | 'type' | 'isPrimary'
>;

export type FriendsQueryVariables = {
  searchQuery?: Maybe<Scalars['String']>;
  count?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
};

export type FriendsQuery = { __typename?: 'RootQuery' } & {
  friends: { __typename?: 'FriendsPagination' } & {
    items: Array<
      { __typename: 'User' } & Pick<User, 'id' | 'fullName' | 'username'>
    >;
    pageInfo: { __typename?: 'PaginationInfo' } & Pick<
      PaginationInfo,
      'hasNext' | 'nextCursor'
    >;
  };
};

export type OtherUserFragment = { __typename: 'User' } & Pick<
  User,
  | 'id'
  | 'fullName'
  | 'username'
  | 'isFriend'
  | 'isRequested'
  | 'hasRequestedUser'
  | 'isBlocked'
>;

export type PendingFriendRequestsQueryVariables = {
  count?: Maybe<Scalars['Int']>;
};

export type PendingFriendRequestsQuery = { __typename?: 'RootQuery' } & {
  pendingFriendRequests: Array<
    Maybe<{ __typename: 'User' } & Pick<User, 'id' | 'fullName' | 'username'>>
  >;
};

export type PhoneNumberFragment = { __typename: 'PhoneNumberDeet' } & Pick<
  PhoneNumberDeet,
  | 'id'
  | 'notes'
  | 'label'
  | 'phoneNumber'
  | 'countryCode'
  | 'updatedAt'
  | 'type'
  | 'isPrimary'
>;

export type RemoveFriendMutationVariables = {
  targetUserId: Scalars['Int'];
};

export type RemoveFriendMutation = { __typename?: 'RootMutation' } & {
  removeFriend: { __typename?: 'User' } & OtherUserFragment;
};

export type RequestFriendMutationVariables = {
  targetUserId: Scalars['Int'];
};

export type RequestFriendMutation = { __typename?: 'RootMutation' } & {
  requestFriend: { __typename?: 'User' } & OtherUserFragment;
};

export type RescindFriendRequestMutationVariables = {
  targetUserId: Scalars['Int'];
};

export type RescindFriendRequestMutation = { __typename?: 'RootMutation' } & {
  rescindFriendRequest: { __typename?: 'User' } & OtherUserFragment;
};

export type SearchUsersQueryVariables = {
  searchQuery: Scalars['String'];
  count?: Maybe<Scalars['Int']>;
};

export type SearchUsersQuery = { __typename?: 'RootQuery' } & {
  searchUsers: Array<Maybe<{ __typename?: 'User' } & OtherUserFragment>>;
};

export type UnblockUserMutationVariables = {
  targetUserId: Scalars['Int'];
};

export type UnblockUserMutation = { __typename?: 'RootMutation' } & {
  unblockUser: { __typename?: 'User' } & OtherUserFragment;
};

export type UpcomingBirthdaysQueryVariables = {
  days?: Maybe<Scalars['Int']>;
};

export type UpcomingBirthdaysQuery = { __typename?: 'RootQuery' } & {
  upcomingBirthdays: Array<
    { __typename?: 'BirthdayUser' } & Pick<
      BirthdayUser,
      'id' | 'username' | 'fullName' | 'birthday' | 'birthdayYear'
    >
  >;
};

export type UpdatePasswordMutationVariables = {
  newPassword: Scalars['String'];
  passwordVerification: Scalars['String'];
};

export type UpdatePasswordMutation = { __typename?: 'RootMutation' } & Pick<
  RootMutation,
  'updatePassword'
>;

export type UpdateSharedPermissionsMutationVariables = {
  deetId: Scalars['Int'];
  userIdsToAdd: Array<Maybe<Scalars['Int']>>;
  userIdsToRemove: Array<Maybe<Scalars['Int']>>;
};

export type UpdateSharedPermissionsMutation = {
  __typename?: 'RootMutation';
} & {
  updateSharedPermissions: Maybe<
    Array<Maybe<{ __typename?: 'User' } & UserAccessFragment>>
  >;
};

export type UpdateUserMutationVariables = {
  email: Scalars['String'];
  passwordVerification: Scalars['String'];
  givenName: Scalars['String'];
  familyName: Scalars['String'];
  birthday?: Maybe<Scalars['String']>;
};

export type UpdateUserMutation = { __typename?: 'RootMutation' } & {
  updateUser: { __typename?: 'User' } & CurrentUserFragment;
};

export type UpsertAddressMutationVariables = {
  deetId?: Maybe<Scalars['Int']>;
  notes: Scalars['String'];
  label: Scalars['String'];
  addressLine1: Scalars['String'];
  addressLine2: Scalars['String'];
  city: Scalars['String'];
  state: Scalars['String'];
  postalCode: Scalars['String'];
  countryCode: Scalars['String'];
  isPrimary: Scalars['Boolean'];
};

export type UpsertAddressMutation = { __typename?: 'RootMutation' } & {
  upsertAddress: { __typename?: 'AddressDeet' } & {
    owner: { __typename?: 'User' } & BaseUserFragment;
  } & AddressFragment;
};

export type UpsertEmailAddressMutationVariables = {
  deetId?: Maybe<Scalars['Int']>;
  notes: Scalars['String'];
  label: Scalars['String'];
  emailAddress: Scalars['String'];
  isPrimary: Scalars['Boolean'];
};

export type UpsertEmailAddressMutation = { __typename?: 'RootMutation' } & {
  upsertEmailAddress: {
    __typename?: 'EmailAddressDeet';
  } & EmailAddressFragment;
};

export type UpsertPhoneNumberMutationVariables = {
  deetId?: Maybe<Scalars['Int']>;
  notes: Scalars['String'];
  label: Scalars['String'];
  phoneNumber: Scalars['String'];
  countryCode: Scalars['String'];
  isPrimary: Scalars['Boolean'];
};

export type UpsertPhoneNumberMutation = { __typename?: 'RootMutation' } & {
  upsertPhoneNumber: { __typename?: 'PhoneNumberDeet' } & {
    owner: { __typename?: 'User' } & BaseUserFragment;
  } & PhoneNumberFragment;
};

export type UserAccessFragment = { __typename: 'User' } & Pick<
  User,
  'id' | 'fullName' | 'username' | 'hasAccessToDeet'
>;

export type UserTodosQueryVariables = {};

export type UserTodosQuery = { __typename?: 'RootQuery' } & {
  userTodos: { __typename?: 'UserTodos' } & Pick<
    UserTodos,
    | 'hasFriends'
    | 'hasDeets'
    | 'hasPrimaryAddress'
    | 'hasPrimaryPhoneNumber'
    | 'hasPrimaryEmailAddress'
  >;
};
export const AddressFragmentDoc = gql`
  fragment Address on AddressDeet {
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
    isPrimary
    __typename
  }
`;
export const BaseUserFragmentDoc = gql`
  fragment BaseUser on User {
    id
    username
    fullName
    __typename
  }
`;
export const CurrentUserFragmentDoc = gql`
  fragment CurrentUser on User {
    id
    username
    givenName
    familyName
    email
    birthdayDate
    birthdayYear
    __typename
  }
`;
export const EmailAddressFragmentDoc = gql`
  fragment EmailAddress on EmailAddressDeet {
    id
    notes
    label
    emailAddress
    updatedAt
    type
    isPrimary
    __typename
  }
`;
export const OtherUserFragmentDoc = gql`
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
export const PhoneNumberFragmentDoc = gql`
  fragment PhoneNumber on PhoneNumberDeet {
    id
    notes
    label
    phoneNumber
    countryCode
    updatedAt
    type
    isPrimary
    __typename
  }
`;
export const UserAccessFragmentDoc = gql`
  fragment UserAccess on User {
    id
    fullName
    username
    hasAccessToDeet(deetId: $deetId)
    __typename
  }
`;
export const AcceptFriendRequestDocument = gql`
  mutation acceptFriendRequest($targetUserId: Int!) {
    acceptFriendRequest(targetUserId: $targetUserId) {
      ...OtherUser
    }
  }
  ${OtherUserFragmentDoc}
`;
export type AcceptFriendRequestMutationFn = ReactApollo.MutationFn<
  AcceptFriendRequestMutation,
  AcceptFriendRequestMutationVariables
>;
export type AcceptFriendRequestComponentProps = Omit<
  ReactApollo.MutationProps<
    AcceptFriendRequestMutation,
    AcceptFriendRequestMutationVariables
  >,
  'mutation'
>;

export const AcceptFriendRequestComponent = (
  props: AcceptFriendRequestComponentProps,
) => (
  <ReactApollo.Mutation<
    AcceptFriendRequestMutation,
    AcceptFriendRequestMutationVariables
  >
    mutation={AcceptFriendRequestDocument}
    {...props}
  />
);

export type AcceptFriendRequestProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<
    AcceptFriendRequestMutation,
    AcceptFriendRequestMutationVariables
  >
> &
  TChildProps;
export function withAcceptFriendRequest<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    AcceptFriendRequestMutation,
    AcceptFriendRequestMutationVariables,
    AcceptFriendRequestProps<TChildProps>
  >,
) {
  return ReactApollo.withMutation<
    TProps,
    AcceptFriendRequestMutation,
    AcceptFriendRequestMutationVariables,
    AcceptFriendRequestProps<TChildProps>
  >(AcceptFriendRequestDocument, {
    alias: 'withAcceptFriendRequest',
    ...operationOptions,
  });
}

export function useAcceptFriendRequestMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    AcceptFriendRequestMutation,
    AcceptFriendRequestMutationVariables
  >,
) {
  return ReactApolloHooks.useMutation<
    AcceptFriendRequestMutation,
    AcceptFriendRequestMutationVariables
  >(AcceptFriendRequestDocument, baseOptions);
}
export type AcceptFriendRequestMutationHookResult = ReturnType<
  typeof useAcceptFriendRequestMutation
>;
export const AccessibleDeetsDocument = gql`
  query accessibleDeets($type: String, $after: String, $count: Int) {
    accessibleDeets(type: $type, count: $count, after: $after) {
      items {
        ... on EmailAddressDeet {
          ...EmailAddress
          owner {
            ...BaseUser
          }
        }
        ... on AddressDeet {
          ...Address
          owner {
            ...BaseUser
          }
        }
        ... on PhoneNumberDeet {
          ...PhoneNumber
          owner {
            ...BaseUser
          }
        }
      }
      pageInfo {
        hasNext
        nextCursor
      }
    }
  }
  ${EmailAddressFragmentDoc}
  ${BaseUserFragmentDoc}
  ${AddressFragmentDoc}
  ${PhoneNumberFragmentDoc}
`;
export type AccessibleDeetsComponentProps = Omit<
  ReactApollo.QueryProps<AccessibleDeetsQuery, AccessibleDeetsQueryVariables>,
  'query'
>;

export const AccessibleDeetsComponent = (
  props: AccessibleDeetsComponentProps,
) => (
  <ReactApollo.Query<AccessibleDeetsQuery, AccessibleDeetsQueryVariables>
    query={AccessibleDeetsDocument}
    {...props}
  />
);

export type AccessibleDeetsProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<AccessibleDeetsQuery, AccessibleDeetsQueryVariables>
> &
  TChildProps;
export function withAccessibleDeets<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    AccessibleDeetsQuery,
    AccessibleDeetsQueryVariables,
    AccessibleDeetsProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    AccessibleDeetsQuery,
    AccessibleDeetsQueryVariables,
    AccessibleDeetsProps<TChildProps>
  >(AccessibleDeetsDocument, {
    alias: 'withAccessibleDeets',
    ...operationOptions,
  });
}

export function useAccessibleDeetsQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    AccessibleDeetsQueryVariables
  >,
) {
  return ReactApolloHooks.useQuery<
    AccessibleDeetsQuery,
    AccessibleDeetsQueryVariables
  >(AccessibleDeetsDocument, baseOptions);
}
export type AccessibleDeetsQueryHookResult = ReturnType<
  typeof useAccessibleDeetsQuery
>;
export const BlockUserDocument = gql`
  mutation blockUser($targetUserId: Int!) {
    blockUser(targetUserId: $targetUserId) {
      ...OtherUser
    }
  }
  ${OtherUserFragmentDoc}
`;
export type BlockUserMutationFn = ReactApollo.MutationFn<
  BlockUserMutation,
  BlockUserMutationVariables
>;
export type BlockUserComponentProps = Omit<
  ReactApollo.MutationProps<BlockUserMutation, BlockUserMutationVariables>,
  'mutation'
>;

export const BlockUserComponent = (props: BlockUserComponentProps) => (
  <ReactApollo.Mutation<BlockUserMutation, BlockUserMutationVariables>
    mutation={BlockUserDocument}
    {...props}
  />
);

export type BlockUserProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<BlockUserMutation, BlockUserMutationVariables>
> &
  TChildProps;
export function withBlockUser<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    BlockUserMutation,
    BlockUserMutationVariables,
    BlockUserProps<TChildProps>
  >,
) {
  return ReactApollo.withMutation<
    TProps,
    BlockUserMutation,
    BlockUserMutationVariables,
    BlockUserProps<TChildProps>
  >(BlockUserDocument, {
    alias: 'withBlockUser',
    ...operationOptions,
  });
}

export function useBlockUserMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    BlockUserMutation,
    BlockUserMutationVariables
  >,
) {
  return ReactApolloHooks.useMutation<
    BlockUserMutation,
    BlockUserMutationVariables
  >(BlockUserDocument, baseOptions);
}
export type BlockUserMutationHookResult = ReturnType<
  typeof useBlockUserMutation
>;
export const CurrentUserDeetsDocument = gql`
  query currentUserDeets {
    userDeets {
      ...EmailAddress
      ...Address
      ...PhoneNumber
    }
  }
  ${EmailAddressFragmentDoc}
  ${AddressFragmentDoc}
  ${PhoneNumberFragmentDoc}
`;
export type CurrentUserDeetsComponentProps = Omit<
  ReactApollo.QueryProps<CurrentUserDeetsQuery, CurrentUserDeetsQueryVariables>,
  'query'
>;

export const CurrentUserDeetsComponent = (
  props: CurrentUserDeetsComponentProps,
) => (
  <ReactApollo.Query<CurrentUserDeetsQuery, CurrentUserDeetsQueryVariables>
    query={CurrentUserDeetsDocument}
    {...props}
  />
);

export type CurrentUserDeetsProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<CurrentUserDeetsQuery, CurrentUserDeetsQueryVariables>
> &
  TChildProps;
export function withCurrentUserDeets<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    CurrentUserDeetsQuery,
    CurrentUserDeetsQueryVariables,
    CurrentUserDeetsProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    CurrentUserDeetsQuery,
    CurrentUserDeetsQueryVariables,
    CurrentUserDeetsProps<TChildProps>
  >(CurrentUserDeetsDocument, {
    alias: 'withCurrentUserDeets',
    ...operationOptions,
  });
}

export function useCurrentUserDeetsQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    CurrentUserDeetsQueryVariables
  >,
) {
  return ReactApolloHooks.useQuery<
    CurrentUserDeetsQuery,
    CurrentUserDeetsQueryVariables
  >(CurrentUserDeetsDocument, baseOptions);
}
export type CurrentUserDeetsQueryHookResult = ReturnType<
  typeof useCurrentUserDeetsQuery
>;
export const DeetPermsDocument = gql`
  query deetPerms(
    $searchQuery: String
    $count: Int
    $after: String
    $deetId: Int!
  ) {
    friends(searchQuery: $searchQuery, count: $count, after: $after) {
      items {
        ...UserAccess
      }
      pageInfo {
        hasNext
        nextCursor
      }
    }
  }
  ${UserAccessFragmentDoc}
`;
export type DeetPermsComponentProps = Omit<
  ReactApollo.QueryProps<DeetPermsQuery, DeetPermsQueryVariables>,
  'query'
> &
  ({ variables: DeetPermsQueryVariables; skip?: false } | { skip: true });

export const DeetPermsComponent = (props: DeetPermsComponentProps) => (
  <ReactApollo.Query<DeetPermsQuery, DeetPermsQueryVariables>
    query={DeetPermsDocument}
    {...props}
  />
);

export type DeetPermsProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<DeetPermsQuery, DeetPermsQueryVariables>
> &
  TChildProps;
export function withDeetPerms<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    DeetPermsQuery,
    DeetPermsQueryVariables,
    DeetPermsProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    DeetPermsQuery,
    DeetPermsQueryVariables,
    DeetPermsProps<TChildProps>
  >(DeetPermsDocument, {
    alias: 'withDeetPerms',
    ...operationOptions,
  });
}

export function useDeetPermsQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<DeetPermsQueryVariables>,
) {
  return ReactApolloHooks.useQuery<DeetPermsQuery, DeetPermsQueryVariables>(
    DeetPermsDocument,
    baseOptions,
  );
}
export type DeetPermsQueryHookResult = ReturnType<typeof useDeetPermsQuery>;
export const DeleteDeetDocument = gql`
  mutation deleteDeet($deetId: Int!) {
    deleteDeet(deetId: $deetId) {
      ...EmailAddress
      ...Address
      ...PhoneNumber
    }
  }
  ${EmailAddressFragmentDoc}
  ${AddressFragmentDoc}
  ${PhoneNumberFragmentDoc}
`;
export type DeleteDeetMutationFn = ReactApollo.MutationFn<
  DeleteDeetMutation,
  DeleteDeetMutationVariables
>;
export type DeleteDeetComponentProps = Omit<
  ReactApollo.MutationProps<DeleteDeetMutation, DeleteDeetMutationVariables>,
  'mutation'
>;

export const DeleteDeetComponent = (props: DeleteDeetComponentProps) => (
  <ReactApollo.Mutation<DeleteDeetMutation, DeleteDeetMutationVariables>
    mutation={DeleteDeetDocument}
    {...props}
  />
);

export type DeleteDeetProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<DeleteDeetMutation, DeleteDeetMutationVariables>
> &
  TChildProps;
export function withDeleteDeet<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    DeleteDeetMutation,
    DeleteDeetMutationVariables,
    DeleteDeetProps<TChildProps>
  >,
) {
  return ReactApollo.withMutation<
    TProps,
    DeleteDeetMutation,
    DeleteDeetMutationVariables,
    DeleteDeetProps<TChildProps>
  >(DeleteDeetDocument, {
    alias: 'withDeleteDeet',
    ...operationOptions,
  });
}

export function useDeleteDeetMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    DeleteDeetMutation,
    DeleteDeetMutationVariables
  >,
) {
  return ReactApolloHooks.useMutation<
    DeleteDeetMutation,
    DeleteDeetMutationVariables
  >(DeleteDeetDocument, baseOptions);
}
export type DeleteDeetMutationHookResult = ReturnType<
  typeof useDeleteDeetMutation
>;
export const FriendsDocument = gql`
  query friends($searchQuery: String, $count: Int, $after: String) {
    friends(searchQuery: $searchQuery, count: $count, after: $after) {
      items {
        id
        fullName
        username
        __typename
      }
      pageInfo {
        hasNext
        nextCursor
      }
    }
  }
`;
export type FriendsComponentProps = Omit<
  ReactApollo.QueryProps<FriendsQuery, FriendsQueryVariables>,
  'query'
>;

export const FriendsComponent = (props: FriendsComponentProps) => (
  <ReactApollo.Query<FriendsQuery, FriendsQueryVariables>
    query={FriendsDocument}
    {...props}
  />
);

export type FriendsProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<FriendsQuery, FriendsQueryVariables>
> &
  TChildProps;
export function withFriends<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    FriendsQuery,
    FriendsQueryVariables,
    FriendsProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    FriendsQuery,
    FriendsQueryVariables,
    FriendsProps<TChildProps>
  >(FriendsDocument, {
    alias: 'withFriends',
    ...operationOptions,
  });
}

export function useFriendsQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<FriendsQueryVariables>,
) {
  return ReactApolloHooks.useQuery<FriendsQuery, FriendsQueryVariables>(
    FriendsDocument,
    baseOptions,
  );
}
export type FriendsQueryHookResult = ReturnType<typeof useFriendsQuery>;
export const PendingFriendRequestsDocument = gql`
  query pendingFriendRequests($count: Int) {
    pendingFriendRequests(count: $count) {
      id
      fullName
      username
      __typename
    }
  }
`;
export type PendingFriendRequestsComponentProps = Omit<
  ReactApollo.QueryProps<
    PendingFriendRequestsQuery,
    PendingFriendRequestsQueryVariables
  >,
  'query'
>;

export const PendingFriendRequestsComponent = (
  props: PendingFriendRequestsComponentProps,
) => (
  <ReactApollo.Query<
    PendingFriendRequestsQuery,
    PendingFriendRequestsQueryVariables
  >
    query={PendingFriendRequestsDocument}
    {...props}
  />
);

export type PendingFriendRequestsProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<
    PendingFriendRequestsQuery,
    PendingFriendRequestsQueryVariables
  >
> &
  TChildProps;
export function withPendingFriendRequests<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    PendingFriendRequestsQuery,
    PendingFriendRequestsQueryVariables,
    PendingFriendRequestsProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    PendingFriendRequestsQuery,
    PendingFriendRequestsQueryVariables,
    PendingFriendRequestsProps<TChildProps>
  >(PendingFriendRequestsDocument, {
    alias: 'withPendingFriendRequests',
    ...operationOptions,
  });
}

export function usePendingFriendRequestsQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    PendingFriendRequestsQueryVariables
  >,
) {
  return ReactApolloHooks.useQuery<
    PendingFriendRequestsQuery,
    PendingFriendRequestsQueryVariables
  >(PendingFriendRequestsDocument, baseOptions);
}
export type PendingFriendRequestsQueryHookResult = ReturnType<
  typeof usePendingFriendRequestsQuery
>;
export const RemoveFriendDocument = gql`
  mutation removeFriend($targetUserId: Int!) {
    removeFriend(targetUserId: $targetUserId) {
      ...OtherUser
    }
  }
  ${OtherUserFragmentDoc}
`;
export type RemoveFriendMutationFn = ReactApollo.MutationFn<
  RemoveFriendMutation,
  RemoveFriendMutationVariables
>;
export type RemoveFriendComponentProps = Omit<
  ReactApollo.MutationProps<
    RemoveFriendMutation,
    RemoveFriendMutationVariables
  >,
  'mutation'
>;

export const RemoveFriendComponent = (props: RemoveFriendComponentProps) => (
  <ReactApollo.Mutation<RemoveFriendMutation, RemoveFriendMutationVariables>
    mutation={RemoveFriendDocument}
    {...props}
  />
);

export type RemoveFriendProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<RemoveFriendMutation, RemoveFriendMutationVariables>
> &
  TChildProps;
export function withRemoveFriend<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    RemoveFriendMutation,
    RemoveFriendMutationVariables,
    RemoveFriendProps<TChildProps>
  >,
) {
  return ReactApollo.withMutation<
    TProps,
    RemoveFriendMutation,
    RemoveFriendMutationVariables,
    RemoveFriendProps<TChildProps>
  >(RemoveFriendDocument, {
    alias: 'withRemoveFriend',
    ...operationOptions,
  });
}

export function useRemoveFriendMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    RemoveFriendMutation,
    RemoveFriendMutationVariables
  >,
) {
  return ReactApolloHooks.useMutation<
    RemoveFriendMutation,
    RemoveFriendMutationVariables
  >(RemoveFriendDocument, baseOptions);
}
export type RemoveFriendMutationHookResult = ReturnType<
  typeof useRemoveFriendMutation
>;
export const RequestFriendDocument = gql`
  mutation requestFriend($targetUserId: Int!) {
    requestFriend(targetUserId: $targetUserId) {
      ...OtherUser
    }
  }
  ${OtherUserFragmentDoc}
`;
export type RequestFriendMutationFn = ReactApollo.MutationFn<
  RequestFriendMutation,
  RequestFriendMutationVariables
>;
export type RequestFriendComponentProps = Omit<
  ReactApollo.MutationProps<
    RequestFriendMutation,
    RequestFriendMutationVariables
  >,
  'mutation'
>;

export const RequestFriendComponent = (props: RequestFriendComponentProps) => (
  <ReactApollo.Mutation<RequestFriendMutation, RequestFriendMutationVariables>
    mutation={RequestFriendDocument}
    {...props}
  />
);

export type RequestFriendProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<RequestFriendMutation, RequestFriendMutationVariables>
> &
  TChildProps;
export function withRequestFriend<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    RequestFriendMutation,
    RequestFriendMutationVariables,
    RequestFriendProps<TChildProps>
  >,
) {
  return ReactApollo.withMutation<
    TProps,
    RequestFriendMutation,
    RequestFriendMutationVariables,
    RequestFriendProps<TChildProps>
  >(RequestFriendDocument, {
    alias: 'withRequestFriend',
    ...operationOptions,
  });
}

export function useRequestFriendMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    RequestFriendMutation,
    RequestFriendMutationVariables
  >,
) {
  return ReactApolloHooks.useMutation<
    RequestFriendMutation,
    RequestFriendMutationVariables
  >(RequestFriendDocument, baseOptions);
}
export type RequestFriendMutationHookResult = ReturnType<
  typeof useRequestFriendMutation
>;
export const RescindFriendRequestDocument = gql`
  mutation rescindFriendRequest($targetUserId: Int!) {
    rescindFriendRequest(targetUserId: $targetUserId) {
      ...OtherUser
    }
  }
  ${OtherUserFragmentDoc}
`;
export type RescindFriendRequestMutationFn = ReactApollo.MutationFn<
  RescindFriendRequestMutation,
  RescindFriendRequestMutationVariables
>;
export type RescindFriendRequestComponentProps = Omit<
  ReactApollo.MutationProps<
    RescindFriendRequestMutation,
    RescindFriendRequestMutationVariables
  >,
  'mutation'
>;

export const RescindFriendRequestComponent = (
  props: RescindFriendRequestComponentProps,
) => (
  <ReactApollo.Mutation<
    RescindFriendRequestMutation,
    RescindFriendRequestMutationVariables
  >
    mutation={RescindFriendRequestDocument}
    {...props}
  />
);

export type RescindFriendRequestProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<
    RescindFriendRequestMutation,
    RescindFriendRequestMutationVariables
  >
> &
  TChildProps;
export function withRescindFriendRequest<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    RescindFriendRequestMutation,
    RescindFriendRequestMutationVariables,
    RescindFriendRequestProps<TChildProps>
  >,
) {
  return ReactApollo.withMutation<
    TProps,
    RescindFriendRequestMutation,
    RescindFriendRequestMutationVariables,
    RescindFriendRequestProps<TChildProps>
  >(RescindFriendRequestDocument, {
    alias: 'withRescindFriendRequest',
    ...operationOptions,
  });
}

export function useRescindFriendRequestMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    RescindFriendRequestMutation,
    RescindFriendRequestMutationVariables
  >,
) {
  return ReactApolloHooks.useMutation<
    RescindFriendRequestMutation,
    RescindFriendRequestMutationVariables
  >(RescindFriendRequestDocument, baseOptions);
}
export type RescindFriendRequestMutationHookResult = ReturnType<
  typeof useRescindFriendRequestMutation
>;
export const SearchUsersDocument = gql`
  query searchUsers($searchQuery: String!, $count: Int) {
    searchUsers(searchQuery: $searchQuery, count: $count) {
      ...OtherUser
    }
  }
  ${OtherUserFragmentDoc}
`;
export type SearchUsersComponentProps = Omit<
  ReactApollo.QueryProps<SearchUsersQuery, SearchUsersQueryVariables>,
  'query'
> &
  ({ variables: SearchUsersQueryVariables; skip?: false } | { skip: true });

export const SearchUsersComponent = (props: SearchUsersComponentProps) => (
  <ReactApollo.Query<SearchUsersQuery, SearchUsersQueryVariables>
    query={SearchUsersDocument}
    {...props}
  />
);

export type SearchUsersProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<SearchUsersQuery, SearchUsersQueryVariables>
> &
  TChildProps;
export function withSearchUsers<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    SearchUsersQuery,
    SearchUsersQueryVariables,
    SearchUsersProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    SearchUsersQuery,
    SearchUsersQueryVariables,
    SearchUsersProps<TChildProps>
  >(SearchUsersDocument, {
    alias: 'withSearchUsers',
    ...operationOptions,
  });
}

export function useSearchUsersQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<SearchUsersQueryVariables>,
) {
  return ReactApolloHooks.useQuery<SearchUsersQuery, SearchUsersQueryVariables>(
    SearchUsersDocument,
    baseOptions,
  );
}
export type SearchUsersQueryHookResult = ReturnType<typeof useSearchUsersQuery>;
export const UnblockUserDocument = gql`
  mutation unblockUser($targetUserId: Int!) {
    unblockUser(targetUserId: $targetUserId) {
      ...OtherUser
    }
  }
  ${OtherUserFragmentDoc}
`;
export type UnblockUserMutationFn = ReactApollo.MutationFn<
  UnblockUserMutation,
  UnblockUserMutationVariables
>;
export type UnblockUserComponentProps = Omit<
  ReactApollo.MutationProps<UnblockUserMutation, UnblockUserMutationVariables>,
  'mutation'
>;

export const UnblockUserComponent = (props: UnblockUserComponentProps) => (
  <ReactApollo.Mutation<UnblockUserMutation, UnblockUserMutationVariables>
    mutation={UnblockUserDocument}
    {...props}
  />
);

export type UnblockUserProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<UnblockUserMutation, UnblockUserMutationVariables>
> &
  TChildProps;
export function withUnblockUser<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    UnblockUserMutation,
    UnblockUserMutationVariables,
    UnblockUserProps<TChildProps>
  >,
) {
  return ReactApollo.withMutation<
    TProps,
    UnblockUserMutation,
    UnblockUserMutationVariables,
    UnblockUserProps<TChildProps>
  >(UnblockUserDocument, {
    alias: 'withUnblockUser',
    ...operationOptions,
  });
}

export function useUnblockUserMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    UnblockUserMutation,
    UnblockUserMutationVariables
  >,
) {
  return ReactApolloHooks.useMutation<
    UnblockUserMutation,
    UnblockUserMutationVariables
  >(UnblockUserDocument, baseOptions);
}
export type UnblockUserMutationHookResult = ReturnType<
  typeof useUnblockUserMutation
>;
export const UpcomingBirthdaysDocument = gql`
  query upcomingBirthdays($days: Int) {
    upcomingBirthdays(days: $days) {
      id
      username
      fullName
      birthday
      birthdayYear
    }
  }
`;
export type UpcomingBirthdaysComponentProps = Omit<
  ReactApollo.QueryProps<
    UpcomingBirthdaysQuery,
    UpcomingBirthdaysQueryVariables
  >,
  'query'
>;

export const UpcomingBirthdaysComponent = (
  props: UpcomingBirthdaysComponentProps,
) => (
  <ReactApollo.Query<UpcomingBirthdaysQuery, UpcomingBirthdaysQueryVariables>
    query={UpcomingBirthdaysDocument}
    {...props}
  />
);

export type UpcomingBirthdaysProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<UpcomingBirthdaysQuery, UpcomingBirthdaysQueryVariables>
> &
  TChildProps;
export function withUpcomingBirthdays<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    UpcomingBirthdaysQuery,
    UpcomingBirthdaysQueryVariables,
    UpcomingBirthdaysProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    UpcomingBirthdaysQuery,
    UpcomingBirthdaysQueryVariables,
    UpcomingBirthdaysProps<TChildProps>
  >(UpcomingBirthdaysDocument, {
    alias: 'withUpcomingBirthdays',
    ...operationOptions,
  });
}

export function useUpcomingBirthdaysQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    UpcomingBirthdaysQueryVariables
  >,
) {
  return ReactApolloHooks.useQuery<
    UpcomingBirthdaysQuery,
    UpcomingBirthdaysQueryVariables
  >(UpcomingBirthdaysDocument, baseOptions);
}
export type UpcomingBirthdaysQueryHookResult = ReturnType<
  typeof useUpcomingBirthdaysQuery
>;
export const UpdatePasswordDocument = gql`
  mutation updatePassword(
    $newPassword: String!
    $passwordVerification: String!
  ) {
    updatePassword(
      newPassword: $newPassword
      passwordVerification: $passwordVerification
    )
  }
`;
export type UpdatePasswordMutationFn = ReactApollo.MutationFn<
  UpdatePasswordMutation,
  UpdatePasswordMutationVariables
>;
export type UpdatePasswordComponentProps = Omit<
  ReactApollo.MutationProps<
    UpdatePasswordMutation,
    UpdatePasswordMutationVariables
  >,
  'mutation'
>;

export const UpdatePasswordComponent = (
  props: UpdatePasswordComponentProps,
) => (
  <ReactApollo.Mutation<UpdatePasswordMutation, UpdatePasswordMutationVariables>
    mutation={UpdatePasswordDocument}
    {...props}
  />
);

export type UpdatePasswordProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<
    UpdatePasswordMutation,
    UpdatePasswordMutationVariables
  >
> &
  TChildProps;
export function withUpdatePassword<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    UpdatePasswordMutation,
    UpdatePasswordMutationVariables,
    UpdatePasswordProps<TChildProps>
  >,
) {
  return ReactApollo.withMutation<
    TProps,
    UpdatePasswordMutation,
    UpdatePasswordMutationVariables,
    UpdatePasswordProps<TChildProps>
  >(UpdatePasswordDocument, {
    alias: 'withUpdatePassword',
    ...operationOptions,
  });
}

export function useUpdatePasswordMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    UpdatePasswordMutation,
    UpdatePasswordMutationVariables
  >,
) {
  return ReactApolloHooks.useMutation<
    UpdatePasswordMutation,
    UpdatePasswordMutationVariables
  >(UpdatePasswordDocument, baseOptions);
}
export type UpdatePasswordMutationHookResult = ReturnType<
  typeof useUpdatePasswordMutation
>;
export const UpdateSharedPermissionsDocument = gql`
  mutation updateSharedPermissions(
    $deetId: Int!
    $userIdsToAdd: [Int]!
    $userIdsToRemove: [Int]!
  ) {
    updateSharedPermissions(
      deetId: $deetId
      userIdsToAdd: $userIdsToAdd
      userIdsToRemove: $userIdsToRemove
    ) {
      ...UserAccess
    }
  }
  ${UserAccessFragmentDoc}
`;
export type UpdateSharedPermissionsMutationFn = ReactApollo.MutationFn<
  UpdateSharedPermissionsMutation,
  UpdateSharedPermissionsMutationVariables
>;
export type UpdateSharedPermissionsComponentProps = Omit<
  ReactApollo.MutationProps<
    UpdateSharedPermissionsMutation,
    UpdateSharedPermissionsMutationVariables
  >,
  'mutation'
>;

export const UpdateSharedPermissionsComponent = (
  props: UpdateSharedPermissionsComponentProps,
) => (
  <ReactApollo.Mutation<
    UpdateSharedPermissionsMutation,
    UpdateSharedPermissionsMutationVariables
  >
    mutation={UpdateSharedPermissionsDocument}
    {...props}
  />
);

export type UpdateSharedPermissionsProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<
    UpdateSharedPermissionsMutation,
    UpdateSharedPermissionsMutationVariables
  >
> &
  TChildProps;
export function withUpdateSharedPermissions<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    UpdateSharedPermissionsMutation,
    UpdateSharedPermissionsMutationVariables,
    UpdateSharedPermissionsProps<TChildProps>
  >,
) {
  return ReactApollo.withMutation<
    TProps,
    UpdateSharedPermissionsMutation,
    UpdateSharedPermissionsMutationVariables,
    UpdateSharedPermissionsProps<TChildProps>
  >(UpdateSharedPermissionsDocument, {
    alias: 'withUpdateSharedPermissions',
    ...operationOptions,
  });
}

export function useUpdateSharedPermissionsMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    UpdateSharedPermissionsMutation,
    UpdateSharedPermissionsMutationVariables
  >,
) {
  return ReactApolloHooks.useMutation<
    UpdateSharedPermissionsMutation,
    UpdateSharedPermissionsMutationVariables
  >(UpdateSharedPermissionsDocument, baseOptions);
}
export type UpdateSharedPermissionsMutationHookResult = ReturnType<
  typeof useUpdateSharedPermissionsMutation
>;
export const UpdateUserDocument = gql`
  mutation updateUser(
    $email: String!
    $passwordVerification: String!
    $givenName: String!
    $familyName: String!
    $birthday: String
  ) {
    updateUser(
      email: $email
      passwordVerification: $passwordVerification
      givenName: $givenName
      familyName: $familyName
      birthday: $birthday
    ) {
      ...CurrentUser
    }
  }
  ${CurrentUserFragmentDoc}
`;
export type UpdateUserMutationFn = ReactApollo.MutationFn<
  UpdateUserMutation,
  UpdateUserMutationVariables
>;
export type UpdateUserComponentProps = Omit<
  ReactApollo.MutationProps<UpdateUserMutation, UpdateUserMutationVariables>,
  'mutation'
>;

export const UpdateUserComponent = (props: UpdateUserComponentProps) => (
  <ReactApollo.Mutation<UpdateUserMutation, UpdateUserMutationVariables>
    mutation={UpdateUserDocument}
    {...props}
  />
);

export type UpdateUserProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<UpdateUserMutation, UpdateUserMutationVariables>
> &
  TChildProps;
export function withUpdateUser<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    UpdateUserMutation,
    UpdateUserMutationVariables,
    UpdateUserProps<TChildProps>
  >,
) {
  return ReactApollo.withMutation<
    TProps,
    UpdateUserMutation,
    UpdateUserMutationVariables,
    UpdateUserProps<TChildProps>
  >(UpdateUserDocument, {
    alias: 'withUpdateUser',
    ...operationOptions,
  });
}

export function useUpdateUserMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    UpdateUserMutation,
    UpdateUserMutationVariables
  >,
) {
  return ReactApolloHooks.useMutation<
    UpdateUserMutation,
    UpdateUserMutationVariables
  >(UpdateUserDocument, baseOptions);
}
export type UpdateUserMutationHookResult = ReturnType<
  typeof useUpdateUserMutation
>;
export const UpsertAddressDocument = gql`
  mutation upsertAddress(
    $deetId: Int
    $notes: String!
    $label: String!
    $addressLine1: String!
    $addressLine2: String!
    $city: String!
    $state: String!
    $postalCode: String!
    $countryCode: String!
    $isPrimary: Boolean!
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
      isPrimary: $isPrimary
    ) {
      ...Address
      owner {
        ...BaseUser
      }
    }
  }
  ${AddressFragmentDoc}
  ${BaseUserFragmentDoc}
`;
export type UpsertAddressMutationFn = ReactApollo.MutationFn<
  UpsertAddressMutation,
  UpsertAddressMutationVariables
>;
export type UpsertAddressComponentProps = Omit<
  ReactApollo.MutationProps<
    UpsertAddressMutation,
    UpsertAddressMutationVariables
  >,
  'mutation'
>;

export const UpsertAddressComponent = (props: UpsertAddressComponentProps) => (
  <ReactApollo.Mutation<UpsertAddressMutation, UpsertAddressMutationVariables>
    mutation={UpsertAddressDocument}
    {...props}
  />
);

export type UpsertAddressProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<UpsertAddressMutation, UpsertAddressMutationVariables>
> &
  TChildProps;
export function withUpsertAddress<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    UpsertAddressMutation,
    UpsertAddressMutationVariables,
    UpsertAddressProps<TChildProps>
  >,
) {
  return ReactApollo.withMutation<
    TProps,
    UpsertAddressMutation,
    UpsertAddressMutationVariables,
    UpsertAddressProps<TChildProps>
  >(UpsertAddressDocument, {
    alias: 'withUpsertAddress',
    ...operationOptions,
  });
}

export function useUpsertAddressMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    UpsertAddressMutation,
    UpsertAddressMutationVariables
  >,
) {
  return ReactApolloHooks.useMutation<
    UpsertAddressMutation,
    UpsertAddressMutationVariables
  >(UpsertAddressDocument, baseOptions);
}
export type UpsertAddressMutationHookResult = ReturnType<
  typeof useUpsertAddressMutation
>;
export const UpsertEmailAddressDocument = gql`
  mutation upsertEmailAddress(
    $deetId: Int
    $notes: String!
    $label: String!
    $emailAddress: String!
    $isPrimary: Boolean!
  ) {
    upsertEmailAddress(
      deetId: $deetId
      notes: $notes
      label: $label
      emailAddress: $emailAddress
      isPrimary: $isPrimary
    ) {
      ...EmailAddress
    }
  }
  ${EmailAddressFragmentDoc}
`;
export type UpsertEmailAddressMutationFn = ReactApollo.MutationFn<
  UpsertEmailAddressMutation,
  UpsertEmailAddressMutationVariables
>;
export type UpsertEmailAddressComponentProps = Omit<
  ReactApollo.MutationProps<
    UpsertEmailAddressMutation,
    UpsertEmailAddressMutationVariables
  >,
  'mutation'
>;

export const UpsertEmailAddressComponent = (
  props: UpsertEmailAddressComponentProps,
) => (
  <ReactApollo.Mutation<
    UpsertEmailAddressMutation,
    UpsertEmailAddressMutationVariables
  >
    mutation={UpsertEmailAddressDocument}
    {...props}
  />
);

export type UpsertEmailAddressProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<
    UpsertEmailAddressMutation,
    UpsertEmailAddressMutationVariables
  >
> &
  TChildProps;
export function withUpsertEmailAddress<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    UpsertEmailAddressMutation,
    UpsertEmailAddressMutationVariables,
    UpsertEmailAddressProps<TChildProps>
  >,
) {
  return ReactApollo.withMutation<
    TProps,
    UpsertEmailAddressMutation,
    UpsertEmailAddressMutationVariables,
    UpsertEmailAddressProps<TChildProps>
  >(UpsertEmailAddressDocument, {
    alias: 'withUpsertEmailAddress',
    ...operationOptions,
  });
}

export function useUpsertEmailAddressMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    UpsertEmailAddressMutation,
    UpsertEmailAddressMutationVariables
  >,
) {
  return ReactApolloHooks.useMutation<
    UpsertEmailAddressMutation,
    UpsertEmailAddressMutationVariables
  >(UpsertEmailAddressDocument, baseOptions);
}
export type UpsertEmailAddressMutationHookResult = ReturnType<
  typeof useUpsertEmailAddressMutation
>;
export const UpsertPhoneNumberDocument = gql`
  mutation upsertPhoneNumber(
    $deetId: Int
    $notes: String!
    $label: String!
    $phoneNumber: String!
    $countryCode: String!
    $isPrimary: Boolean!
  ) {
    upsertPhoneNumber(
      deetId: $deetId
      notes: $notes
      label: $label
      phoneNumber: $phoneNumber
      countryCode: $countryCode
      isPrimary: $isPrimary
    ) {
      ...PhoneNumber
      owner {
        ...BaseUser
      }
    }
  }
  ${PhoneNumberFragmentDoc}
  ${BaseUserFragmentDoc}
`;
export type UpsertPhoneNumberMutationFn = ReactApollo.MutationFn<
  UpsertPhoneNumberMutation,
  UpsertPhoneNumberMutationVariables
>;
export type UpsertPhoneNumberComponentProps = Omit<
  ReactApollo.MutationProps<
    UpsertPhoneNumberMutation,
    UpsertPhoneNumberMutationVariables
  >,
  'mutation'
>;

export const UpsertPhoneNumberComponent = (
  props: UpsertPhoneNumberComponentProps,
) => (
  <ReactApollo.Mutation<
    UpsertPhoneNumberMutation,
    UpsertPhoneNumberMutationVariables
  >
    mutation={UpsertPhoneNumberDocument}
    {...props}
  />
);

export type UpsertPhoneNumberProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<
    UpsertPhoneNumberMutation,
    UpsertPhoneNumberMutationVariables
  >
> &
  TChildProps;
export function withUpsertPhoneNumber<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    UpsertPhoneNumberMutation,
    UpsertPhoneNumberMutationVariables,
    UpsertPhoneNumberProps<TChildProps>
  >,
) {
  return ReactApollo.withMutation<
    TProps,
    UpsertPhoneNumberMutation,
    UpsertPhoneNumberMutationVariables,
    UpsertPhoneNumberProps<TChildProps>
  >(UpsertPhoneNumberDocument, {
    alias: 'withUpsertPhoneNumber',
    ...operationOptions,
  });
}

export function useUpsertPhoneNumberMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    UpsertPhoneNumberMutation,
    UpsertPhoneNumberMutationVariables
  >,
) {
  return ReactApolloHooks.useMutation<
    UpsertPhoneNumberMutation,
    UpsertPhoneNumberMutationVariables
  >(UpsertPhoneNumberDocument, baseOptions);
}
export type UpsertPhoneNumberMutationHookResult = ReturnType<
  typeof useUpsertPhoneNumberMutation
>;
export const UserTodosDocument = gql`
  query userTodos {
    userTodos {
      hasFriends
      hasDeets
      hasPrimaryAddress
      hasPrimaryPhoneNumber
      hasPrimaryEmailAddress
    }
  }
`;
export type UserTodosComponentProps = Omit<
  ReactApollo.QueryProps<UserTodosQuery, UserTodosQueryVariables>,
  'query'
>;

export const UserTodosComponent = (props: UserTodosComponentProps) => (
  <ReactApollo.Query<UserTodosQuery, UserTodosQueryVariables>
    query={UserTodosDocument}
    {...props}
  />
);

export type UserTodosProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<UserTodosQuery, UserTodosQueryVariables>
> &
  TChildProps;
export function withUserTodos<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    UserTodosQuery,
    UserTodosQueryVariables,
    UserTodosProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    UserTodosQuery,
    UserTodosQueryVariables,
    UserTodosProps<TChildProps>
  >(UserTodosDocument, {
    alias: 'withUserTodos',
    ...operationOptions,
  });
}

export function useUserTodosQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<UserTodosQueryVariables>,
) {
  return ReactApolloHooks.useQuery<UserTodosQuery, UserTodosQueryVariables>(
    UserTodosDocument,
    baseOptions,
  );
}
export type UserTodosQueryHookResult = ReturnType<typeof useUserTodosQuery>;
