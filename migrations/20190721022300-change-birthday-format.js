'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('users', 'birthday_date', {
        type: Sequelize.DATEONLY,
        allowNull: true,
      })
      .then(() =>
        queryInterface.addColumn('users', 'birthday_year', {
          type: Sequelize.INTEGER,
          allowNull: true,
        }),
      )
      .then(() => queryInterface.removeColumn('users', 'birthday'));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('users', 'birthday', {
        type: Sequelize.DATE,
        allowNull: true,
      })
      .then(() => queryInterface.removeColumn('users', 'birthday_date'))
      .then(() => queryInterface.removeColumn('users', 'birthday_year'));
  },
};
