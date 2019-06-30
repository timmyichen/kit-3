import { Table, Column, Model } from 'sequelize-typescript';

@Table({
  tableName: 'friendships',
  indexes: [{ fields: ['first_user_id'] }],
})
export default class Friendships extends Model<Friendships> {
  @Column({
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  })
  first_user_id: number;

  @Column({
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  })
  second_user_id: number;
}
