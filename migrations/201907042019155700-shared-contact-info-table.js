'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('shared_contact_infos', {
      info_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'contact_infos',
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
      CREATE INDEX shared_contact_infos_shared_with_id_idx ON shared_contact_infos (shared_with)
    `))
    .then(() => queryInterface.sequelize.query(`
      CREATE INDEX shared_contact_infos_info_id_idx ON shared_contact_infos (info_id)
    `))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS shared_contact_infos_shared_with_id_idx;
    `)
      .then(() => queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS shared_contact_infos_info_id_idx;
    `))
      .then(() => queryInterface.dropTable('shared_contact_infos'))
  }
};