import {
  Table,
  Column,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { requiredString } from 'server/lib/model';
import Deets from './Deets';

@Table({
  tableName: 'email_addresses',
  timestamps: false,
  indexes: [{ unique: false, fields: ['deet_id'] }],
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

  @ForeignKey(() => Deets)
  @Column
  deet_id: number;

  @BelongsTo(() => Deets)
  deet: Deets;
}
