'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('deets', 'primary', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('deets', 'primary')
  }
};