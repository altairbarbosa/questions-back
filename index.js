const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/questionarios', require('./routes/questionario.routes'));
app.use('/api/auth', require('./routes/auth.routes')); // se desejar

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
