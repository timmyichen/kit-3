import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { requiredString } from 'server/lib/model';

@Table({
  tableName: 'users',
  paranoid: true,
  timestamps: true,
  indexes: [
    { unique: true, fields: ['id'] },
    { unique: true, fields: ['username'] },
    { unique: true, fields: ['email'] },
    { unique: false, fields: ['updated_at'] },
  ],
})
export default class Users extends Model<Users> {
  @Column({
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    ...requiredString(),
  })
  given_name: string;

  @Column({
    ...requiredString(),
  })
  family_name: string;

  @Column({
    ...requiredString({
      validate: {
        len: [4, 24],
      },
    }),
  })
  username: string;

  @Column({
    ...requiredString(),
  })
  password: string;

  @Column({
    ...requiredString({
      validate: {
        isEmail: true,
      },
    }),
  })
  email: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: {},
  })
  settings: Object;

  @Column
  birthday_date: Date;

  @Column
  birthday_year: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
