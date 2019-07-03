'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('addresses', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      address_line_1: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address_line_2: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '',
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '',
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '',
      },
      postal_code: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '',
      },
      country_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      notes: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '',
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    })
    .then(() => queryInterface.createTable('email_addresses', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      email_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      notes: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '',
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    }))
    .then(() => queryInterface.createTable('phone_numbers', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      country_code: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '',
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      notes: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '',
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    }))
    .then(() => queryInterface.sequelize.query(`
      CREATE INDEX addresses_owner_id_idx ON addresses (owner_id)
    `))
    .then(() => queryInterface.sequelize.query(`
      CREATE INDEX email_addresses_owner_id_idx ON email_addresses (owner_id)
    `))
    .then(() => queryInterface.sequelize.query(`
      CREATE INDEX phone_numbers_owner_id_idx ON phone_numbers (owner_id)
    `))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
        DROP INDEX IF EXISTS addresses_owner_id_idx
      `)
      .then(() => queryInterface.sequelize.query(`
        DROP INDEX IF EXISTS email_addresses_owner_id_idx
      `))
      .then(() => queryInterface.sequelize.query(`
        DROP INDEX IF EXISTS phone_numbers_owner_id_idx
      `))
      .then(() => queryInterface.dropTable('email_addresses'))
      .then(() => queryInterface.dropTable('email_addresses'))
      .then(() => queryInterface.dropTable('addresses'));
  }
};