const db = require("../models");
const Resposta = db.Resposta;
const RespostaUsuario = db.RespostaUsuario;
const Pergunta = db.Pergunta;
const Questionario = db.Questionario;
const Usuario = db.Usuario;

module.exports = {
  // Criar alternativas (respostas) para uma pergunta
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

  // Listar alternativas de uma pergunta
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

  // Salvar respostas de um usuário para um questionário
  async salvarRespostasUsuario(req, res) {
    const usuario_id = req.usuario?.id || req.userId; // compatível com os middlewares existentes
    const { questionario_id, respostas } = req.body;

    try {
      // Remove respostas anteriores, se existirem
      await RespostaUsuario.destroy({ where: { usuario_id, questionario_id } });

      for (let r of respostas) {
        const resposta = await Resposta.findByPk(r.alternativa_id);
        const correta = resposta?.correta || false;

        await RespostaUsuario.create({
          usuario_id,
          questionario_id,
          pergunta_id: r.pergunta_id,
          resposta_id: r.alternativa_id,
          correta,
          data_resposta: new Date()
        });
      }

      return res.status(201).json({ mensagem: "Respostas registradas com sucesso!" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao registrar respostas do usuário" });
    }
  },

  // Obter resultado das respostas do usuário para um questionário
  async resultado(req, res) {
    const usuario_id = req.usuario?.id || req.userId;
    const { questionario_id } = req.params;

    try {
      const questionario = await Questionario.findByPk(questionario_id);
      if (!questionario) {
        return res.status(404).json({ erro: "Questionário não encontrado" });
      }

      // Busca perguntas e alternativas corretas
      const perguntas = await Pergunta.findAll({
        include: [
          {
            model: Resposta,
            as: "respostas"
          }
        ],
        includeIgnoreAttributes: false
      });

      const respostasUsuario = await RespostaUsuario.findAll({
        where: { usuario_id, questionario_id }
      });

      const detalhes = perguntas.map(pergunta => {
        const respostaUser = respostasUsuario.find(r => r.pergunta_id === pergunta.id);
        const alternativaCorreta = pergunta.respostas.find(r => r.correta);

        return {
          pergunta_id: pergunta.id,
          texto: pergunta.texto,
          resposta_usuario: respostaUser?.resposta_id || null,
          resposta_correta: alternativaCorreta?.id || null,
          correta: respostaUser?.resposta_id === alternativaCorreta?.id
        };
      });

      const acertos = detalhes.filter(d => d.correta).length;

      return res.json({
        questionario: questionario.titulo,
        total: detalhes.length,
        acertos,
        detalhes
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao gerar resultado" });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { texto, correta } = req.body;

      const resposta = await db.Resposta.findByPk(id);
      if (!resposta) {
        return res.status(404).json({ erro: 'Alternativa não encontrada' });
      }

      // Força o tipo booleano, pois `correta` pode vir como string ("true"/"false")
      resposta.texto = texto;
      resposta.correta = correta === true || correta === 'true';
      await resposta.save();

      return res.json({ mensagem: 'Alternativa atualizada com sucesso', resposta });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao atualizar alternativa' });
    }
  }
};
