import {
  Table,
  Column,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { requiredString } from 'server/lib/model';
import ContactInfos from './ContactInfos';

@Table({
  tableName: 'email_addresses',
  timestamps: false,
  indexes: [{ unique: false, fields: ['info_id'] }],
})
export default class EmailAddresses extends Model<EmailAddresses> {
  @PrimaryKey
  @Column({
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @Column(requiredString())
  email_address: string;

  @ForeignKey(() => ContactInfos)
  @Column
  info_id: number;

  @BelongsTo(() => ContactInfos)
  info: ContactInfos;
}
