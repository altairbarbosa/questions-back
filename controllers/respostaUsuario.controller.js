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
  },

  async responderEmLote(req, res) {
    try {
      const usuario_id = req.usuario?.id || 1;
      const { questionario_id, respostas } = req.body;

      console.log("Recebido:", { usuario_id, questionario_id, respostas });

      if (!Array.isArray(respostas) || respostas.length === 0) {
        return res.status(400).json({ erro: 'Nenhuma resposta fornecida' });
      }

      const registros = [];

      for (const r of respostas) {
        const resposta = await Resposta.findByPk(r.alternativa_id);
        if (!resposta || resposta.pergunta_id !== Number(r.pergunta_id)) {
          return res.status(400).json({ erro: `Resposta inválida para a pergunta ${r.pergunta_id}` });
        }

        registros.push({
          usuario_id,
          pergunta_id: r.pergunta_id,
          resposta_id: r.alternativa_id,
          questionario_id,
          data_resposta: new Date(),
          correta: resposta.correta
        });
      }

      await RespostaUsuario.bulkCreate(registros);

      return res.status(201).json({ mensagem: 'Respostas registradas com sucesso' });
    } catch (err) {
      console.error('Erro ao registrar respostas em lote:', err);
      return res.status(500).json({ erro: 'Erro ao registrar respostas' });
    }
  }
};
