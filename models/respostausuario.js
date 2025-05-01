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
    }
  }

  RespostaUsuario.init({
    usuario_id: DataTypes.INTEGER,
    pergunta_id: DataTypes.INTEGER,
    resposta_id: DataTypes.INTEGER,
    data_resposta: DataTypes.DATE,
    correta: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'RespostaUsuario',
    tableName: 'respostas_usuario'
  });

  return RespostaUsuario;
};
