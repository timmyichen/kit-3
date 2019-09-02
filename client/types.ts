export interface BaseUser {
  id: number;
  fullName: string;
  username: string;
  profilePicture?: string | null;
}

export interface OtherUser extends BaseUser {
  isFriend?: boolean;
  isRequested?: boolean;
  hasRequestedUser?: boolean;
  isBlocked?: boolean;
}

export interface User extends OtherUser {
  __typename: 'User';
}

export interface Friend extends OtherUser {
  birthdayDate?: string;
  birthdayYear?: number;
  birthday?: string;
  hasAccessToDeet?: boolean;
  __typename: 'Friend';
}

export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  familyName: string;
  givenName: string;
  birthdayDate?: Date;
  birthdayYear?: number;
  settings: Object;
  updatedAt: string;
  createdAt: string;
  profilePicture?: string;
  profilePictureId?: number;
  __typename: 'User';
}

export type DeetTypes = 'address' | 'email_address' | 'phone_number';
export type ApolloDeetTypes =
  | 'PhoneNumberDeet'
  | 'AddressDeet'
  | 'EmailAddressDeet';

interface BaseDeet {
  id: number;
  label: string;
  notes: string;
  owner?: Friend;
  updatedAt: string;
  type: DeetTypes;
  isPrimary: boolean;
  verifiedAt: string;
  __typename: ApolloDeetTypes;
}

export interface AddressDeet extends BaseDeet {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface EmailAddressDeet extends BaseDeet {
  emailAddress: string;
}

export interface PhoneNumberDeet extends BaseDeet {
  phoneNumber: string;
  countryCode: string;
}

export type Deet = AddressDeet | EmailAddressDeet | PhoneNumberDeet;

export type MessageType = 'error' | 'confirm' | 'info';

export interface Message {
  id: string;
  type: MessageType;
  content: React.ReactNode;
  time: number;
}

export interface ContextState {
  currentUser: CurrentUser | null;
  modal: React.ReactNode | null;
  messages: Array<Message>;
}

export interface PaginationResponse<T> {
  items: Array<T>;
  pageInfo: {
    hasNext: boolean;
    nextCursor: string;
  };
}
