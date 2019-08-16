'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      given_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      family_name: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [4, 24],
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      settings: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {},
      },
      birthday: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    })
      .then(() => queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX user_username ON users (username) WHERE deleted_at IS NULL;
    `))
      .then(() => queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX user_email ON users (email) WHERE deleted_at IS NULL;
    `))
      .then(() => queryInterface.sequelize.query(`
      CREATE INDEX user_birthday ON users (birthday);
    `));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS user_username
    `)
      .then(() => queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS user_email
    `))
      .then(() => queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS user_birthday
    `))
      .then(() => queryInterface.dropTable('users'))
  }
};