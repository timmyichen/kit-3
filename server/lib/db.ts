import { Sequelize } from 'sequelize-typescript';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

if (
  process.env.NODE_ENV === 'production' &&
  (!process.env.PROD_DB_DATABASE ||
    !process.env.PROD_DB_USER ||
    !process.env.PROD_DB_PASSWORD ||
    !process.env.PROD_DB_HOST ||
    !process.env.PROD_DB_PORT)
) {
  throw new Error('expected env var');
}

export const db = new Sequelize({
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD || undefined,
  host: process.env.DB_HOST || undefined,
  port: parseInt(process.env.DB_PORT as string, 10),
  dialect: 'postgres',
  modelPaths: [path.resolve(__dirname, '..', 'models/schemas')],
});
