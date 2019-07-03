import {
  Table,
  Column,
  Model,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { requiredString, emptyOptionalString } from 'server/lib/model';

@Table({
  tableName: 'phone_numbers',
  timestamps: true,
  indexes: [{ unique: false, fields: ['owner_id'] }],
})
export default class BlockedUsers extends Model<BlockedUsers> {
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

  @Column(emptyOptionalString)
  country_code: string;

  @Column(requiredString())
  phone_number: string;

  @Column(emptyOptionalString)
  notes: string;

  @Column(requiredString())
  label: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
