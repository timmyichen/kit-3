'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('deets', 'verified_at', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      })
      .then(() =>
        queryInterface.sequelize.query(`
          UPDATE deets SET verified_at = updated_at;
      `),
      );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('deets', 'verified_at');
  },
};
