'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Resposta extends Model {
    static associate(models) {
      Resposta.belongsTo(models.Pergunta, {
        foreignKey: 'pergunta_id',
        as: 'pergunta'
      });

      Resposta.hasMany(models.RespostaUsuario, {
        foreignKey: 'resposta_id',
        as: 'respostas_usuario'
      });
    }
  }

  Resposta.init({
    pergunta_id: DataTypes.INTEGER,
    texto: DataTypes.STRING,
    correta: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Resposta',
    tableName: 'respostas'
  });

  return Resposta;
};
