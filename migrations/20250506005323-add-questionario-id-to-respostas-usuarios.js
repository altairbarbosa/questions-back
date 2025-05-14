'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('respostas_usuarios', 'questionario_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'questionarios',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('respostas_usuarios', 'questionario_id');
  }
};
