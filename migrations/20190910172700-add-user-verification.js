'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('users', 'is_verified', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      })
      .then(() =>
        queryInterface.sequelize.query(`
      UPDATE USERS SET is_verified = false;
    `),
      );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'is_verified');
  },
};
