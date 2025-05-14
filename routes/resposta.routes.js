const express = require('express');
const router = express.Router();
const controller = require('../controllers/resposta.controller');
const autenticar = require('../middlewares/auth.middleware');

router.post('/', autenticar, controller.criar);
router.get('/pergunta/:pergunta_id', controller.listarPorPergunta);
router.put('/:id', autenticar, controller.atualizar);

module.exports = router;
