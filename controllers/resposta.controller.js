const db = require('../models');
const Resposta = db.Resposta;

module.exports = {
  async criar(req, res) {
    try {
      const { pergunta_id, respostas } = req.body;

      if (!pergunta_id || !Array.isArray(respostas) || respostas.length === 0) {
        return res.status(400).json({ erro: 'Dados inválidos' });
      }

      const respostasFormatadas = respostas.map(resposta => ({
        ...resposta,
        pergunta_id
      }));

      await Resposta.bulkCreate(respostasFormatadas);

      return res.status(201).json({ mensagem: 'Respostas criadas com sucesso' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao criar respostas' });
    }
  },

  async listarPorPergunta(req, res) {
    try {
      const { pergunta_id } = req.params;
      const respostas = await Resposta.findAll({ where: { pergunta_id } });
      return res.json(respostas);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao listar respostas da pergunta' });
    }
  }
};
