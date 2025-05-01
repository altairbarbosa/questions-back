const db = require('../models');
const Usuario = db.Usuario;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta';

module.exports = {
  async register(req, res) {
    try {
      const { nome, email, senha } = req.body;

      const existe = await Usuario.findOne({ where: { email } });
      if (existe) return res.status(400).json({ mensagem: 'E-mail já registrado' });

      const hash = await bcrypt.hash(senha, 10);
      await Usuario.create({ nome, email, senha: hash });

      return res.status(201).json({ mensagem: 'Usuário criado com sucesso' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ mensagem: 'Erro no registro' });
    }
  },

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) return res.status(401).json({ mensagem: 'Senha inválida' });

      const token = jwt.sign({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }, JWT_SECRET, { expiresIn: '8h' });

      return res.status(200).json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ mensagem: 'Erro no login' });
    }
  }
};
