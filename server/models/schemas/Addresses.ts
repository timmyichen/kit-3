import {
  Table,
  Column,
  Model,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { requiredString, emptyOptionalString } from 'server/lib/model';
import ContactInfos from './ContactInfos';

@Table({
  tableName: 'addresses',
  timestamps: true,
  indexes: [{ unique: false, fields: ['owner_id'] }],
})
export default class Addresses extends Model<Addresses> {
  @PrimaryKey
  @Column({
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @Column({
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  })
  owner_id: number;

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
