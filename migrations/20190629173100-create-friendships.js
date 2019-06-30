'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('friendships', {
      first_user: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      second_user: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    })
    .then(() => queryInterface.createTable('blocked_users', {
      target_user: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      blocked_by: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    }))
    .then(() => queryInterface.createTable('friend_requests', {
      target_user: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      requested_by: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    }))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('friend_requests')
      .then(() => queryInterface.dropTable('blocked_users'))
      .then(() => queryInterface.dropTable('friendships'));
  }
};