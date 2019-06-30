import { Table, Column, Model, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'friend_requests',
  timestamps: false,
})
export default class FriendRequests extends Model<FriendRequests> {
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
  requested_by: number;
}
