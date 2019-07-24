import {
  Table,
  Column,
  Model,
  PrimaryKey,
  BelongsTo,
} from 'sequelize-typescript';
import Users from './Users';

@Table({
  tableName: 'friendships',
  timestamps: false,
})
export default class Friendships extends Model<Friendships> {
  @PrimaryKey
  @Column({
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  })
  first_user: number;

  @PrimaryKey
  @Column({
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  })
  second_user: number;

  @BelongsTo(() => Users, 'second_user')
  friend: Users;
}
