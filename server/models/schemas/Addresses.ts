import {
  Table,
  Column,
  Model,
  PrimaryKey,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { requiredString, emptyOptionalString } from 'server/lib/model';
import Deets from './Deets';

@Table({
  tableName: 'addresses',
  timestamps: false,
  indexes: [{ unique: false, fields: ['deet_id'] }],
})
export default class Addresses extends Model<Addresses> {
  @PrimaryKey
  @Column({
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @Column(requiredString())
  address_line_1: string;

  @Column(emptyOptionalString)
  address_line_2: string;

  @Column(emptyOptionalString)
  city: string;

  @Column(emptyOptionalString)
  state: string;

  @Column(emptyOptionalString)
  postal_code: string;

  @Column(requiredString())
  country_code: string;

  @ForeignKey(() => Deets)
  @Column
  deet_id: number;

  @BelongsTo(() => Deets)
  deet: Deets;

  getType() {
    return 'address';
  }
}
