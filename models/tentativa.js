'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tentativa extends Model {
    static associate(models) {
      Tentativa.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });

      Tentativa.belongsTo(models.Questionario, {
        foreignKey: 'questionario_id',
        as: 'questionario'
      });
    }
  }

  Tentativa.init({
    usuario_id: DataTypes.INTEGER,
    questionario_id: DataTypes.INTEGER,
    inicio: DataTypes.DATE,
    fim: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Tentativa',
    tableName: 'tentativas'
  });

  return Tentativa;
};
