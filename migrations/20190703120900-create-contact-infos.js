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
  },

  down: (queryInterface, Sequelize) => {
    return () => queryInterface.dropTable('email_addresses')
      .then(() => queryInterface.dropTable('phone_numbers'))
      .then(() => queryInterface.dropTable('addresses'));
  }
};