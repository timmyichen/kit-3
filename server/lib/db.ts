import { Sequelize } from 'sequelize-typescript';
import * as path from 'path';
import * as dotenv from 'dotenv';

const config = require('../../config/config');

dotenv.config();

interface SequelizeConfig {
  database: string;
  username: string;
  password?: string;
  host: string;
  port: string | number;
  dialect: 'postgres';
}

if (!process.env.NODE_ENV) {
  throw new Error('Node env not set');
}

const keys = (config as { [e: string]: SequelizeConfig })[process.env.NODE_ENV];

if (!keys) {
  throw new Error(`Config not found for node env ${process.env.NODE_ENV}`);
}

const { database, username, password, host, port, dialect } = keys;

export const db = new Sequelize({
  database,
  username,
  password,
  host,
  port: typeof port === 'number' ? port : parseInt(port, 10),
  dialect,
  modelPaths: [path.resolve(__dirname, '..', 'models/schemas')],
  logging: process.env.NODE_ENV !== 'test',
});
