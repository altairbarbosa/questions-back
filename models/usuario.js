'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.hasMany(models.Questionario, {
        foreignKey: 'usuario_id',
        as: 'questionarios'
      });

      Usuario.hasMany(models.RespostaUsuario, {
        foreignKey: 'usuario_id',
        as: 'respostas_usuario'
      });

      Usuario.hasMany(models.Tentativa, {
        foreignKey: 'usuario_id',
        as: 'tentativas'
      });
    }
  }

  Usuario.init({
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    senha: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios'
  });

  return Usuario;
};
