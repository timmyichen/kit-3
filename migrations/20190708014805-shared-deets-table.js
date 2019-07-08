'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('shared_deets', {
      deet_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'deets',
          key: 'id',
        },
      },
      shared_with: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    })
    .then(() => queryInterface.sequelize.query(`
      CREATE INDEX shared_deets_shared_with_id_idx ON shared_deets (shared_with)
    `))
    .then(() => queryInterface.sequelize.query(`
      CREATE INDEX shared_deets_deet_id_idx ON shared_deets (deet_id)
    `))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS shared_deets_shared_with_id_idx;
    `)
      .then(() => queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS shared_deets_deet_id_idx;
    `))
      .then(() => queryInterface.dropTable('shared_deets'))
  }
};