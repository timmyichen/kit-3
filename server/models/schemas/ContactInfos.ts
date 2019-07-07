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
import { ContactInfoTypes } from '../types';
import { emptyOptionalString, requiredString } from 'server/lib/model';

@Table({
  tableName: 'contact_infos',
  timestamps: true,
  indexes: [{ unique: false, fields: ['owner_id'] }],
})
export default class ContactInfos extends Model<ContactInfos> {
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
  type: ContactInfoTypes;

  @Default(false)
  @AllowNull(false)
  @Column
  primary: boolean;

  @Column(emptyOptionalString)
  notes: string;

  @Column(requiredString())
  label: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @HasOne(() => Addresses, 'info_id')
  address: Addresses;

  @HasOne(() => EmailAddresses, 'info_id')
  email_address: EmailAddresses;

  @HasOne(() => PhoneNumbers, 'info_id')
  phone_number: PhoneNumbers;

  getInfo(opts: Object) {
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
