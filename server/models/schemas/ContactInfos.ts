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
} from 'sequelize-typescript';
import { PhoneNumbers, Addresses, EmailAddresses } from '..';
import { ContactInfoTypes } from '../types';

@Table({
  tableName: 'contact_infos',
  timestamps: false,
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
