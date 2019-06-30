import { Table, Column, Model } from 'sequelize-typescript';

@Table({
  tableName: 'blocked_users',
  indexes: [{ fields: ['blocked_by', 'target_user'] }],
})
export default class BlockedUsers extends Model<BlockedUsers> {
  @Column({
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  })
  target_user: number;

  @Column({
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  })
  blocked_by: number;
}
