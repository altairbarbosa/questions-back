'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class QuestionarioPergunta extends Model {
    static associate(models) {
      QuestionarioPergunta.belongsTo(models.Questionario, {
        foreignKey: 'questionario_id',
        as: 'questionario'
      });

      QuestionarioPergunta.belongsTo(models.Pergunta, {
        foreignKey: 'pergunta_id',
        as: 'pergunta'
      });
    }
  }

  QuestionarioPergunta.init({
    questionario_id: DataTypes.INTEGER,
    pergunta_id: DataTypes.INTEGER,
    ordem: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'QuestionarioPergunta',
    tableName: 'questionarios_perguntas'
  });

  return QuestionarioPergunta;
};
