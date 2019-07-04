import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Unique,
  AllowNull,
} from 'sequelize-typescript';

@Table({
  tableName: 'contact_infos',
  timestamps: false,
})
export default class ContactInfos extends Model<ContactInfos> {
  @PrimaryKey
  @AutoIncrement
  @Unique
  @AllowNull(false)
  @Column
  id: number;

  @AllowNull(false)
  @Column
  type: 'phone_number' | 'address' | 'email_address';
}
