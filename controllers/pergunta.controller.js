const db = require('../models');
const Pergunta = db.Pergunta;
const Resposta = db.Resposta;
const QuestionarioPergunta = db.QuestionarioPergunta;

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
      const questionario_id = req.params.id;
      const usuario_id = req.usuario.id;
      const { texto, justificativa, respostas, tipo } = req.body;

      const novaPergunta = await Pergunta.create({
        texto,
        tipo: tipo || "multipla_escolha",
        justificativa: justificativa || null,
        usuario_id
      });

      // ✅ Criar vínculo com o questionário
      await QuestionarioPergunta.create({
        questionario_id,
        pergunta_id: novaPergunta.id,
        ordem: 0
      });

      if (Array.isArray(respostas) && respostas.length > 0) {
        const respostasComPerguntaId = respostas.map(r => ({
          ...r,
          pergunta_id: novaPergunta.id
        }));
        await Resposta.bulkCreate(respostasComPerguntaId);
      }

      return res.status(201).json({ mensagem: "Pergunta criada com sucesso", pergunta: novaPergunta });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao criar pergunta" });
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

      // Remove o vínculo com o questionário primeiro
      await QuestionarioPergunta.destroy({ where: { pergunta_id: id } });

      // Depois de remover o vínculo, deleta a pergunta
      const deletada = await Pergunta.destroy({ where: { id } });

      if (!deletada) return res.status(404).json({ erro: 'Pergunta não encontrada' });

      return res.json({ mensagem: 'Pergunta deletada com sucesso' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao deletar pergunta' });
    }
  },

  async listarPorQuestionario(req, res) {
    try {
      const { id } = req.params;

      const questionario = await db.Questionario.findByPk(id, {
        include: [
          {
            association: 'perguntas',
            include: [{ model: db.Resposta, as: 'respostas' }]
          }
        ]
      });

      if (!questionario) {
        return res.status(404).json({ erro: 'Questionário não encontrado' });
      }

      return res.json({
        titulo: questionario.titulo,
        perguntas: questionario.perguntas
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao listar perguntas do questionário' });
    }
  },

  async editar(req, res) {
    try {
      const { id } = req.params;
      const { texto, justificativa, tipo } = req.body;

      const pergunta = await Pergunta.findByPk(id);
      if (!pergunta) {
        return res.status(404).json({ erro: 'Pergunta não encontrada' });
      }

      await pergunta.update({
        texto,
        justificativa,
        tipo
      });

      return res.json({ mensagem: 'Pergunta atualizada com sucesso', pergunta });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao atualizar pergunta' });
    }
  }
};
