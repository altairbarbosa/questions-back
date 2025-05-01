const db = require('../models');
const RespostaUsuario = db.RespostaUsuario;
const Pergunta = db.Pergunta;
const Resposta = db.Resposta;

module.exports = {
  async responder(req, res) {
    try {
      const { pergunta_id, resposta_id } = req.body;
      const usuario_id = req.usuario.id;

      const resposta = await Resposta.findByPk(resposta_id);
      if (!resposta || resposta.pergunta_id !== Number(pergunta_id)) {
        return res.status(400).json({ erro: 'Resposta inválida para essa pergunta' });
      }

      const correta = resposta.correta;

      const registro = await RespostaUsuario.create({
        usuario_id,
        pergunta_id,
        resposta_id,
        data_resposta: new Date(),
        correta
      });

      return res.status(201).json({ mensagem: 'Resposta registrada', correta, registro });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao registrar resposta do usuário' });
    }
  },

  async historico(req, res) {
    try {
      const usuario_id = req.usuario.id;
      const respostas = await RespostaUsuario.findAll({
        where: { usuario_id },
        include: [
          { model: Pergunta, as: 'pergunta', attributes: ['id', 'texto'] },
          { model: Resposta, as: 'resposta', attributes: ['id', 'texto', 'correta'] }
        ],
        order: [['data_resposta', 'DESC']]
      });
      return res.json(respostas);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao carregar histórico' });
    }
  }
};
