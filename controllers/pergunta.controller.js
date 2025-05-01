const db = require('../models');
const Pergunta = db.Pergunta;
const Resposta = db.Resposta;

module.exports = {
  async listar(req, res) {
    try {
      const perguntas = await Pergunta.findAll({ include: [{ model: Resposta, as: 'respostas' }] });
      return res.json(perguntas);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao listar perguntas' });
    }
  },

  async criar(req, res) {
    try {
      const { texto, justificativa, respostas } = req.body;
      const novaPergunta = await Pergunta.create({ texto, justificativa });

      if (Array.isArray(respostas) && respostas.length > 0) {
        const respostasComPerguntaId = respostas.map(r => ({ ...r, pergunta_id: novaPergunta.id }));
        await Resposta.bulkCreate(respostasComPerguntaId);
      }

      return res.status(201).json({ mensagem: 'Pergunta criada com sucesso', pergunta: novaPergunta });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao criar pergunta' });
    }
  },

  async verPorId(req, res) {
    try {
      const { id } = req.params;
      const pergunta = await Pergunta.findByPk(id, { include: [{ model: Resposta, as: 'respostas' }] });
      if (!pergunta) return res.status(404).json({ erro: 'Pergunta não encontrada' });
      return res.json(pergunta);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao buscar pergunta' });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const deletada = await Pergunta.destroy({ where: { id } });
      if (!deletada) return res.status(404).json({ erro: 'Pergunta não encontrada' });
      return res.json({ mensagem: 'Pergunta deletada com sucesso' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao deletar pergunta' });
    }
  }
};
