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
  | 'PhoneNumberContactInfo'
  | 'AddressContactInfo'
  | 'EmailAddressContactInfo';

interface BaseDeet {
  id: number;
  label: string;
  notes: string;
  owner: User;
  updatedAt: string;
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
  number: string;
  countryCode: string;
}

export type Deet = AddressDeet | EmailAddressDeet | PhoneNumberDeet;
