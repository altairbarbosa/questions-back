'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Alternativa extends Model {
    static associate(models) {
      Alternativa.belongsTo(models.Pergunta, {
        foreignKey: 'pergunta_id',
        as: 'pergunta'
      });

      Alternativa.hasMany(models.RespostaUsuario, {
        foreignKey: 'alternativa_id',
        as: 'respostas_usuario'
      });
    }
  }

  Alternativa.init({
    texto: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correta: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    pergunta_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Alternativa',
    tableName: 'alternativas'
  });

  return Alternativa;
};
