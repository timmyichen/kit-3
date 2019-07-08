export interface User {
  id: number;
  given_name: string;
  family_name: string;
  username: string;
  password: string;
  email: string;
  settings: Object;
  birthday?: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

interface CommonDeetFields {
  id: number;
  deet_id: number;
}

export interface Address extends CommonDeetFields {
  address_line_1: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country_code: string;
}

export interface PhoneNumber extends CommonDeetFields {
  country_code?: string;
  phone_number: string;
}

export interface EmailAddress extends CommonDeetFields {
  email_address: string;
}

export interface DeetType {
  id: number;
  owner_id: number;
  type: Deet;
  notes?: string;
  label: string;
  created_at: Date;
  updated_at: Date;
  getDeet(o: Object): Promise<any>;
}

export type DeetTypes = 'address' | 'phone_number' | 'email_address';

export type Deet = Address | PhoneNumber | EmailAddress;
