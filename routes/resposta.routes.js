const express = require('express');
const router = express.Router();
const controller = require('../controllers/resposta.controller');
const autenticar = require('../middlewares/auth.middleware');

// Criar respostas para uma pergunta
router.post('/', autenticar, controller.criar);

// Listar respostas por pergunta
router.get('/pergunta/:pergunta_id', controller.listarPorPergunta);

module.exports = router;
