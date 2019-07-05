import {
  Table,
  Column,
  Model,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { requiredString, emptyOptionalString } from 'server/lib/model';
import ContactInfos from './ContactInfos';

@Table({
  tableName: 'phone_numbers',
  timestamps: true,
  indexes: [{ unique: false, fields: ['info_id'] }],
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

  @Column(emptyOptionalString)
  notes: string;

  @Column(requiredString())
  label: string;

  @ForeignKey(() => ContactInfos)
  @Column
  info_id: number;

  @BelongsTo(() => ContactInfos)
  info: ContactInfos;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
