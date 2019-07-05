import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import ContactInfos from './ContactInfos';
import Users from './Users';

@Table({
  tableName: 'shared_contact_infos',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['info_id'] },
    { unique: true, fields: ['shared_with'] },
  ],
})
export default class SharedContactInfos extends Model<SharedContactInfos> {
  @PrimaryKey
  @AllowNull(false)
  @ForeignKey(() => ContactInfos)
  @Column
  info_id: number;

  @PrimaryKey
  @AllowNull(false)
  @ForeignKey(() => Users)
  @Column
  shared_with: number;

  @BelongsTo(() => ContactInfos)
  info: ContactInfos;
}
