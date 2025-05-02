const express = require('express');
const router = express.Router();
const controller = require('../controllers/questionario.controller');
const perguntaController = require("../controllers/pergunta.controller");
const autenticar = require('../middlewares/auth.middleware');

router.get('/publicos', controller.listarPublicos);
router.get('/meus', autenticar, controller.listarPorUsuario);
router.get('/:id', controller.verPorId);
router.get('/:id/perguntas', autenticar, perguntaController.listarPorQuestionario);
router.post('/', autenticar, controller.criar);
router.post('/completo', autenticar, controller.criarCompleto);
router.post("/:id/perguntas", autenticar, perguntaController.criar);
router.delete('/:id', autenticar, controller.deletar);

module.exports = router;
