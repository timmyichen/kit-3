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

interface CommonContactInfoFields {
  id: number;
  owner_id: number;
  notes?: string;
  label: string;
  created_at: Date;
  updated_at: Date;
  info_id: number;
}

export interface Address extends CommonContactInfoFields {
  address_line_1: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country_code: string;
}

export interface PhoneNumber extends CommonContactInfoFields {
  country_code?: string;
  phone_number: string;
}

export interface EmailAddress extends CommonContactInfoFields {
  email_address: string;
}

export type ContactInfoTypes = 'address' | 'phone_number' | 'email_address';

export type ContactInfo = Address | PhoneNumber | EmailAddress;
