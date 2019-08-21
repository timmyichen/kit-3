import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Unique,
  AllowNull,
} from 'sequelize-typescript';

@Table({
  tableName: 'images',
  timestamps: false,
})
export default class Images extends Model<Images> {
  @PrimaryKey
  @AutoIncrement
  @Unique
  @AllowNull(false)
  @Column
  id: number;

  @AllowNull(false)
  @Column
  url: string;
}
