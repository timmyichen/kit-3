'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('friendships', {
      first_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      second_user_id: {
        type: Sequelize.INTEGER,
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
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      blocked_by: {
        type: Sequelize.INTEGER,
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
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      requested_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    }))
    .then(() => queryInterface.sequelize.query(`
      CREATE INDEX friendship_first_user ON friendships (first_user_id);
    `))
    .then(() => queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX friend_request_compound_idx ON friend_requests (target_user, requested_by);
    `))
    .then(() => queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX blocked_users_compound_idx ON blocked_users (target_user, blocked_by);
    `))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
        DROP INDEX IF EXISTS friendship_first_user
      `)
      .then(() => queryInterface.sequelize.query(`
        DROP INDEX IF EXISTS friend_request_compound_idx
      `))
      .then(() => queryInterface.sequelize.query(`
        DROP INDEX IF EXISTS blocked_users_compound_idx
      `))
      .then(() => queryInterface.dropTable('friend_requests'))
      .then(() => queryInterface.dropTable('blocked_users'))
      .then(() => queryInterface.dropTable('friendships'));
  }
};