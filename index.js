require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Debug das rotas
console.log('=== ROTAS REGISTRADAS ===');
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(middleware.route.path, middleware.route.methods);
  } else if (middleware.name === 'router') {
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        console.log(handler.route.path, handler.route.methods);
      }
    });
  }
});

console.log('=========================');

// Rotas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/perguntas', require('./routes/pergunta.routes'));
app.use('/api/questionarios', require('./routes/questionario.routes'));
app.use('/api/respostas', require('./routes/resposta.routes'));
app.use('/api/respostas-usuario', require('./routes/respostaUsuario.routes'));
app.use('/api/tentativas', require('./routes/tentativa.routes'));
app.use('/api/respostas', require('./routes/resposta.routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
