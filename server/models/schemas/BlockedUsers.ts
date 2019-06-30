import { Table, Column, Model, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'blocked_users',
  timestamps: false,
})
export default class BlockedUsers extends Model<BlockedUsers> {
  @PrimaryKey
  @Column({
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  })
  target_user: number;

  @PrimaryKey
  @Column({
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  })
  blocked_by: number;
}
