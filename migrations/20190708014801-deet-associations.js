'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
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
      type: {
        type: Sequelize.ENUM('address', 'phone_number', 'email_address'),
        allowNull: false,
      },
    })
    .then(() => queryInterface.addColumn('addresses', 'deet_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'deets',
        key: 'id',
      },
    }))
    .then(() => queryInterface.addColumn('phone_numbers', 'deet_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'deets',
        key: 'id',
      },
    }))
    .then(() => queryInterface.addColumn('email_addresses', 'deet_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'deets',
        key: 'id',
      },
    }))
    .then(() => queryInterface.sequelize.query(`
      CREATE INDEX deet_owner_id_idx ON deets (owner_id);
    `))
    .then(() => queryInterface.sequelize.query(`
      CREATE INDEX addresses_deet_id_idx ON addresses (deet_id)
    `))
    .then(() => queryInterface.sequelize.query(`
      CREATE INDEX email_addresses_deet_id_idx ON email_addresses (deet_id)
    `))
    .then(() => queryInterface.sequelize.query(`
      CREATE INDEX phone_numbers_deet_id_idx ON phone_numbers (deet_id)
    `))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS addresses_deet_id_idx
    `)
      .then(() => queryInterface.sequelize.query(`
        DROP INDEX IF EXISTS email_addresses_deet_id_idx
      `))
      .then(() => queryInterface.sequelize.query(`
        DROP INDEX IF EXISTS phone_numbers_deet_id_idx
      `))
      .then(() => queryInterface.sequelize.query(`
        DROP INDEX IF EXISTS deet_owner_id_idx;
      `))
      .then(() => queryInterface.removeColumn('email_addresses', 'deet_id'))
      .then(() => queryInterface.removeColumn('phone_numbers', 'deet_id'))
      .then(() => queryInterface.removeColumn('addresses', 'deet_id'))
      .then(() => queryInterface.dropTable('deets'));
  }
};