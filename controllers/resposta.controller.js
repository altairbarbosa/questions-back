const db = require("../models");
const Resposta = db.Resposta;
const RespostaUsuario = db.RespostaUsuario;
const Pergunta = db.Pergunta;
const Alternativa = db.Alternativa;
const Questionario = db.Questionario;

module.exports = {
  // CRUD de alternativas (existente)
  async criar(req, res) {
    try {
      const { pergunta_id, respostas } = req.body;

      if (!pergunta_id || !Array.isArray(respostas) || respostas.length === 0) {
        return res.status(400).json({ erro: "Dados inválidos" });
      }

      const respostasFormatadas = respostas.map(resposta => ({
        ...resposta,
        pergunta_id
      }));

      await Resposta.bulkCreate(respostasFormatadas);

      return res.status(201).json({ mensagem: "Respostas criadas com sucesso" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao criar respostas" });
    }
  },

  async listarPorPergunta(req, res) {
    try {
      const { pergunta_id } = req.params;
      const respostas = await Resposta.findAll({ where: { pergunta_id } });
      return res.json(respostas);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao listar respostas da pergunta" });
    }
  },

  // NOVO: salvar respostas do usuário para um questionário
  async salvarRespostasUsuario(req, res) {
    const usuario_id = req.userId;
    const { questionario_id, respostas } = req.body;

    try {
      await RespostaUsuario.destroy({ where: { usuario_id, questionario_id } });

      for (let r of respostas) {
        const alternativa = await Alternativa.findByPk(r.alternativa_id);
        await RespostaUsuario.create({
          usuario_id,
          questionario_id,
          pergunta_id: r.pergunta_id,
          alternativa_id: r.alternativa_id,
          alternativa_texto: alternativa?.texto || null
        });
      }

      return res.status(201).json({ mensagem: "Respostas salvas" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao salvar respostas do usuário" });
    }
  },

  // NOVO: resultado das respostas do usuário
  async resultado(req, res) {
    const usuario_id = req.userId;
    const { questionario_id } = req.params;

    try {
      const questionario = await Questionario.findByPk(questionario_id);
      const perguntas = await Pergunta.findAll({
        where: { questionario_id },
        include: [{ model: Alternativa }]
      });

      const respostasUsuario = await RespostaUsuario.findAll({
        where: { usuario_id, questionario_id }
      });

      const detalhes = perguntas.map(pergunta => {
        const resposta = respostasUsuario.find(r => r.pergunta_id === pergunta.id);
        const correta = pergunta.Alternativas.find(a => a.correta);

        return {
          pergunta_id: pergunta.id,
          enunciado: pergunta.enunciado,
          resposta_usuario: resposta ? resposta.alternativa_texto || "" : null,
          resposta_correta: correta?.texto || "",
          correta: resposta && correta && resposta.alternativa_id === correta.id
        };
      });

      const acertos = detalhes.filter(d => d.correta).length;

      res.json({
        questionario: questionario.titulo,
        total: detalhes.length,
        acertos,
        detalhes
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao calcular resultado" });
    }
  }
};
