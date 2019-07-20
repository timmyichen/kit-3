'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('deets', 'is_primary', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      })
      .then(() =>
        queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS deets_primary_type_owner_idx ON deets (owner_id, type) WHERE is_primary = true;
    `),
      );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query(
        `
      DROP INDEX IF EXISTS deets_primary_type_owner_idx;
    `,
      )
      .then(() => queryInterface.removeColumn('deets', 'is_primary'));
  },
};
