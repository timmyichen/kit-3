export interface User {
  id: number;
  fullName: string;
  username: string;
  hasAccessToDeet: boolean;
  __typename: 'User';
}

export interface UserSearch extends User {
  isFriend: boolean;
  isRequested: boolean;
  hasRequestedUser: boolean;
  isBlocked: boolean;
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
  owner: User;
  updatedAt: string;
  type: DeetTypes;
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

export interface AuthedUser extends User {
  email: string;
}

export type MessageType = 'error' | 'confirm';

export interface Message {
  type: MessageType;
  content: React.ReactNode;
}

export interface ContextState {
  currentUser: AuthedUser | null;
  modal: React.ReactNode | null;
  message: Message | null;
}

export interface PaginationResponse<T> {
  items: Array<T>;
  pageInfo: {
    hasNext: boolean;
    nextCursor: string;
  };
}
