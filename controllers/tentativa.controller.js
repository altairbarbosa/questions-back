const db = require('../models');
const Tentativa = db.Tentativa;
const Questionario = db.Questionario;

module.exports = {
  async iniciar(req, res) {
    try {
      const usuario_id = req.usuario.id;
      const { questionario_id } = req.body;

      const tentativa = await Tentativa.create({
        usuario_id,
        questionario_id,
        inicio: new Date()
      });

      return res.status(201).json({ mensagem: 'Tentativa iniciada', tentativa });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao iniciar tentativa' });
    }
  },

  async finalizar(req, res) {
    try {
      const { id } = req.params;
      const tentativa = await Tentativa.findByPk(id);

      if (!tentativa) return res.status(404).json({ erro: 'Tentativa não encontrada' });

      tentativa.fim = new Date();
      await tentativa.save();

      return res.json({ mensagem: 'Tentativa finalizada com sucesso', tentativa });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao finalizar tentativa' });
    }
  },

  async listarPorUsuario(req, res) {
    try {
      const usuario_id = req.usuario.id;

      const tentativas = await Tentativa.findAll({
        where: { usuario_id },
        include: [
          { model: Questionario, as: 'questionario', attributes: ['id', 'titulo'] }
        ],
        order: [['inicio', 'DESC']]
      });

      return res.json(tentativas);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao listar tentativas' });
    }
  }
};
