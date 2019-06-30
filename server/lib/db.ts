import { Sequelize } from 'sequelize-typescript';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

if (
  !process.env.DB_DATABASE ||
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_HOST
) {
  throw new Error('expected env var');
}

// @ts-ignore
export const db = new Sequelize({
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  modelPaths: [path.resolve(__dirname, '..', 'models/schemas')],
});
