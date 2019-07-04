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
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('email_addresses', 'info_id')
      .then(() => queryInterface.removeColumn('phone_numbers', 'info_id'))
      .then(() => queryInterface.removeColumn('addresses', 'info_id'))
      .then(() => queryInterface.dropTable('contact_infos'));
  }
};