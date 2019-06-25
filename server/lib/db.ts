import { Sequelize } from 'sequelize-typescript';
import path from 'path';

export const sequelize = new Sequelize({
  database: process.env.PSQL_URL,
  username: process.env.PSQL_USER,
  password: process.env.PSQL_PASS,
  dialect: 'postgres',
  modelPaths: [path.resolve(__dirname, 'server/models/')],
});
