import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Unique,
  AllowNull,
  DataType,
  Default,
  CreatedAt,
  UpdatedAt,
  HasOne,
} from 'sequelize-typescript';
import { PhoneNumbers, Addresses, EmailAddresses } from '..';
import { DeetTypes } from '../types';
import { emptyOptionalString, requiredString } from 'server/lib/model';

@Table({
  tableName: 'deets',
  timestamps: true,
  indexes: [{ unique: false, fields: ['owner_id'] }],
})
export default class Deets extends Model<Deets> {
  @PrimaryKey
  @AutoIncrement
  @Unique
  @AllowNull(false)
  @Column
  id: number;

  @Column({
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  })
  owner_id: number;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM('address', 'phone_number', 'email_address'),
  })
  type: DeetTypes;

  @Default(false)
  @AllowNull(false)
  @Column
  primary: boolean;

  @Column(emptyOptionalString)
  notes: string;

  @Column(requiredString())
  label: string;

  @AllowNull(false)
  @Default(false)
  @Column
  is_primary: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @AllowNull(false)
  @Default(new Date())
  @Column
  verified_at: Date;

  @HasOne(() => Addresses, 'deet_id')
  address: Addresses;

  @HasOne(() => EmailAddresses, 'deet_id')
  email_address: EmailAddresses;

  @HasOne(() => PhoneNumbers, 'deet_id')
  phone_number: PhoneNumbers;

  getDeet(opts: Object) {
    switch (this.type) {
      case 'phone_number':
        return PhoneNumbers.findOne(opts);
      case 'address':
        return Addresses.findOne(opts);
      case 'email_address':
        return EmailAddresses.findOne(opts);
    }
  }
}
