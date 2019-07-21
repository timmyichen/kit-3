export interface User {
  id: number;
  given_name: string;
  family_name: string;
  username: string;
  password: string;
  email: string;
  settings: Object;
  birthday_date?: Date;
  birthday_year: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

interface CommonDeetFields {
  id: number;
  deet_id: number;
  get(o: Object): Object;
}

export interface Address extends CommonDeetFields {
  address_line_1: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country_code: string;
  getType(): 'address';
}

export interface PhoneNumber extends CommonDeetFields {
  country_code?: string;
  phone_number: string;
  getType(): 'phone_number';
}

export interface EmailAddress extends CommonDeetFields {
  email_address: string;
  getType(): 'email_address';
}

export interface DeetType {
  id: number;
  owner_id: number;
  type: DeetTypes;
  notes?: string;
  label: string;
  created_at: Date;
  updated_at: Date;
  getDeet(o: Object): Promise<any>;
  get(o: Object): Object;
  address?: Address;
  phone_number?: PhoneNumber;
  email_address?: EmailAddress;
}

export interface PaginationResponse<T> {
  items: Array<T>;
  pageInfo: {
    hasNext: boolean;
    nextCursor: string;
  };
}

export type DeetTypes = 'address' | 'phone_number' | 'email_address';

export type Deet = Address | PhoneNumber | EmailAddress;
