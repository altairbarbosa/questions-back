const db = require('../models');
const Questionario = db.Questionario;

module.exports = {
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
            include: ['respostas'] // eager loading
          }
        ]
      });

      return res.status(200).json(questionarios);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensagem: 'Erro ao listar questionários' });
    }
  },

  async criar(req, res) {
    try {
      const { titulo, descricao, privacidade, perguntas } = req.body;

      const questionario = await Questionario.create({
        titulo,
        descricao,
        privacidade,
        usuario_id: req.usuario.id, // assumindo JWT decodificado
        criado_em: new Date()
      });

      // associação manual
      if (perguntas && perguntas.length > 0) {
        await questionario.setPerguntas(perguntas); // espera IDs de perguntas
      }

      return res.status(201).json(questionario);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensagem: 'Erro ao criar questionário' });
    }
  }
};
