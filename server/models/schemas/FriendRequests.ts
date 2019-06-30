import { Table, Column, Model } from 'sequelize-typescript';

@Table({
  tableName: 'friend_requests',
  indexes: [{ fields: ['target_user', 'requested_by'] }],
})
export default class FriendRequests extends Model<FriendRequests> {
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
  requested_by: number;
}
