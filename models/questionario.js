'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Questionario extends Model {
    static associate(models) {
      Questionario.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });

      Questionario.belongsToMany(models.Pergunta, {
        through: models.QuestionarioPergunta,
        foreignKey: 'questionario_id',
        otherKey: 'pergunta_id',
        as: 'perguntas'
      });

      Questionario.hasMany(models.Tentativa, {
        foreignKey: 'questionario_id',
        as: 'tentativas'
      });
    }
  }

  Questionario.init({
    usuario_id: DataTypes.INTEGER,
    titulo: DataTypes.STRING,
    descricao: DataTypes.TEXT,
    privacidade: DataTypes.ENUM('publico', 'privado'),
    criado_em: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Questionario',
    tableName: 'questionarios'
  });

  return Questionario;
};
