import {
  Table,
  Column,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { requiredString, emptyOptionalString } from 'server/lib/model';
import Deets from './Deets';

@Table({
  tableName: 'phone_numbers',
  timestamps: false,
  indexes: [{ unique: false, fields: ['deet_id'] }],
})
export default class PhoneNumbers extends Model<PhoneNumbers> {
  @PrimaryKey
  @Column({
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @Column(emptyOptionalString)
  country_code: string;

  @Column(requiredString())
  phone_number: string;

  @ForeignKey(() => Deets)
  @Column
  deet_id: number;

  @BelongsTo(() => Deets)
  deet: Deets;
}
