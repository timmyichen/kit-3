require('dotenv').config();

module.exports = {
  development: {
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
  },
  development: {
    database: process.env.PROD_DB_DATABASE,
    username: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASSWORD,
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT,
    dialect: 'postgres',
  },
};
