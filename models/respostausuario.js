'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RespostaUsuario extends Model {
    static associate(models) {
      RespostaUsuario.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });

      RespostaUsuario.belongsTo(models.Pergunta, {
        foreignKey: 'pergunta_id',
        as: 'pergunta'
      });

      RespostaUsuario.belongsTo(models.Resposta, {
        foreignKey: 'resposta_id',
        as: 'resposta'
      });

      RespostaUsuario.belongsTo(models.Questionario, {
        foreignKey: 'questionario_id',
        as: 'questionario'
      });
    }
  }

  RespostaUsuario.init({
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pergunta_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    resposta_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    questionario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    data_resposta: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    correta: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'RespostaUsuario',
    tableName: 'respostas_usuarios'
  });

  return RespostaUsuario;
};
