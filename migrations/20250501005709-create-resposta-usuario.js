'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('respostas_usuarios', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      pergunta_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'perguntas',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      resposta_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'respostas',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      questionario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'questionarios',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      data_resposta: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      correta: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('respostas_usuarios');
  }
};
