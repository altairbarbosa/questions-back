const db = require('../models');
const Questionario = db.Questionario;
const Pergunta = db.Pergunta;
const Resposta = db.Resposta;
const QuestionarioPergunta = db.QuestionarioPergunta;

module.exports = {
  // Listar questionários públicos
  async listarPublicos(req, res) {
    try {
      const questionarios = await Questionario.findAll({
        where: { privacidade: 'publico' },
        include: [
          {
            association: 'usuario',
            attributes: ['id', 'nome']
          },
          {
            association: 'perguntas',
            include: [{ model: Resposta, as: 'respostas' }]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return res.json(questionarios);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao listar questionários públicos' });
    }
  },

  // Criar questionário simples (com perguntas já existentes)
  async criar(req, res) {
    try {
      const { titulo, descricao, privacidade, perguntas } = req.body;
      const usuario_id = req.usuario.id;

      const questionario = await Questionario.create({
        titulo,
        descricao,
        privacidade,
        usuario_id,
        criado_em: new Date()
      });

      if (perguntas && perguntas.length > 0) {
        await questionario.setPerguntas(perguntas);
      }

      return res.status(201).json(questionario);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao criar questionário' });
    }
  },

  // Visualizar um questionário por ID
  async verPorId(req, res) {
    try {
      const { id } = req.params;

      const questionario = await Questionario.findByPk(id, {
        include: [
          {
            association: 'perguntas',
            include: [{ model: Resposta, as: 'respostas' }]
          }
        ]
      });

      if (!questionario) {
        return res.status(404).json({ erro: 'Questionário não encontrado' });
      }

      return res.json(questionario);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao buscar questionário' });
    }
  },

  // Listar questionários do usuário logado
  async listarPorUsuario(req, res) {
    try {
      const usuario_id = req.usuario.id;

      const questionarios = await Questionario.findAll({
        where: { usuario_id },
        include: [
          {
            association: 'perguntas',
            include: [{ model: Resposta, as: 'respostas' }]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return res.json(questionarios);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao listar seus questionários' });
    }
  },

  // Deletar questionário
  async deletar(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.usuario.id;

      const questionario = await Questionario.findByPk(id);
      if (!questionario || questionario.usuario_id !== usuario_id) {
        return res.status(404).json({ erro: 'Questionário não encontrado ou acesso negado' });
      }

      await Questionario.destroy({ where: { id } });

      return res.json({ mensagem: 'Questionário deletado com sucesso' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao deletar questionário' });
    }
  },

  // Criar questionário completo com perguntas e respostas
  async criarCompleto(req, res) {
    const transaction = await db.sequelize.transaction();

    try {
      const usuario_id = req.usuario.id;
      const { titulo, descricao, privacidade, perguntas } = req.body;

      const questionario = await Questionario.create({
        titulo,
        descricao,
        privacidade,
        usuario_id,
        criado_em: new Date()
      }, { transaction });

      for (const p of perguntas) {
        const pergunta = await Pergunta.create({
          texto: p.texto,
          justificativa: p.justificativa || null
        }, { transaction });

        await QuestionarioPergunta.create({
          questionario_id: questionario.id,
          pergunta_id: pergunta.id,
          ordem: p.ordem || 0
        }, { transaction });

        if (Array.isArray(p.respostas)) {
          const respostasFormatadas = p.respostas.map(r => ({
            pergunta_id: pergunta.id,
            texto: r.texto,
            correta: !!r.correta
          }));
          await Resposta.bulkCreate(respostasFormatadas, { transaction });
        }
      }

      await transaction.commit();
      return res.status(201).json({
        mensagem: 'Questionário completo criado com sucesso',
        questionario_id: questionario.id
      });

    } catch (err) {
      await transaction.rollback();
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao criar questionário completo' });
    }
  }
};
