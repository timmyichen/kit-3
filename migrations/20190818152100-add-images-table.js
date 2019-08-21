'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('images', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        url: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      })
      .then(() =>
        queryInterface.addColumn('users', 'profile_picture_id', {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'images',
            key: 'id',
          }
        }),
      )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn('users', 'profile_picture_id')
      .then(() => queryInterface.dropTable('images'))
  },
};
