'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pergunta extends Model {
    static associate(models) {
      Pergunta.belongsToMany(models.Questionario, {
        through: models.QuestionarioPergunta,
        foreignKey: 'pergunta_id',
        otherKey: 'questionario_id',
        as: 'questionarios'
      });

      Pergunta.hasMany(models.Resposta, {
        foreignKey: 'pergunta_id',
        as: 'respostas'
      });

      Pergunta.hasMany(models.RespostaUsuario, {
        foreignKey: 'pergunta_id',
        as: 'respostas_usuario'
      });
    }
  }

  Pergunta.init({
    texto: DataTypes.TEXT,
    justificativa: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Pergunta',
    tableName: 'perguntas'
  });

  return Pergunta;
};
