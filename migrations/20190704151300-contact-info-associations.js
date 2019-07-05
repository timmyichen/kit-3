'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('contact_infos', {
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
      type: {
        type: Sequelize.ENUM('address', 'phone_number', 'email_address'),
        allowNull: false,
      },
    })
    .then(() => queryInterface.addColumn('addresses', 'info_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'contact_infos',
        key: 'id',
      },
    }))
    .then(() => queryInterface.addColumn('phone_numbers', 'info_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'contact_infos',
        key: 'id',
      },
    }))
    .then(() => queryInterface.addColumn('email_addresses', 'info_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'contact_infos',
        key: 'id',
      },
    }))
    .then(() => queryInterface.sequelize.query(`
      CREATE INDEX contact_info_owner_id_idx ON contact_infos (owner_id);
    `))
    .then(() => queryInterface.sequelize.query(`
      CREATE INDEX addresses_info_id_idx ON addresses (info_id)
    `))
    .then(() => queryInterface.sequelize.query(`
      CREATE INDEX email_addresses_info_id_idx ON email_addresses (info_id)
    `))
    .then(() => queryInterface.sequelize.query(`
      CREATE INDEX phone_numbers_info_id_idx ON phone_numbers (info_id)
    `))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS addresses_info_id_idx
    `)
      .then(() => queryInterface.sequelize.query(`
        DROP INDEX IF EXISTS email_addresses_info_id_idx
      `))
      .then(() => queryInterface.sequelize.query(`
        DROP INDEX IF EXISTS phone_numbers_info_id_idx
      `))
      .then(() => queryInterface.sequelize.query(`
        DROP INDEX IF EXISTS contact_info_owner_id_idx;
      `))
      .then(() => queryInterface.removeColumn('email_addresses', 'info_id'))
      .then(() => queryInterface.removeColumn('phone_numbers', 'info_id'))
      .then(() => queryInterface.removeColumn('addresses', 'info_id'))
      .then(() => queryInterface.dropTable('contact_infos'));
  }
};