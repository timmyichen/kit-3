import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import Deets from './Deets';
import Users from './Users';

@Table({
  tableName: 'shared_deets',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['deet_id'] },
    { unique: true, fields: ['shared_with'] },
  ],
})
export default class SharedDeets extends Model<SharedDeets> {
  @PrimaryKey
  @AllowNull(false)
  @ForeignKey(() => Deets)
  @Column
  deet_id: number;

  @PrimaryKey
  @AllowNull(false)
  @ForeignKey(() => Users)
  @Column
  shared_with: number;

  @BelongsTo(() => Deets)
  deet: Deets;
}
