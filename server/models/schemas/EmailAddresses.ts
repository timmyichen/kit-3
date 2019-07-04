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
  tableName: 'email_addresses',
  timestamps: true,
  indexes: [{ unique: false, fields: ['owner_id'] }],
})
export default class EmailAddresses extends Model<EmailAddresses> {
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
  email_address: string;

  @Column(emptyOptionalString)
  notes: string;

  @Column(requiredString())
  label: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
