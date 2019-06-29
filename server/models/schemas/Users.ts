import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { requiredString } from '../../lib/model';

@Table({
  tableName: 'users',
  paranoid: true,
  timestamps: true,
  indexes: [
    { unique: true, fields: ['id'] },
    { unique: true, fields: ['username'] },
    { unique: true, fields: ['email'] },
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
  givenName: string;

  @Column({
    ...requiredString(),
  })
  familyName: string;

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
  birthday: Date;
}
