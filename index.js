require('dotenv').config(); // Carrega variáveis do .env
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Rotas da aplicação
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/perguntas', require('./routes/pergunta.routes'));
app.use('/api/questionarios', require('./routes/questionario.routes'));
app.use('/api/respostas', require('./routes/resposta.routes'));
app.use('/api/respostas-usuario', require('./routes/respostaUsuario.routes'));
app.use('/api/tentativas', require('./routes/tentativa.routes'));

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
