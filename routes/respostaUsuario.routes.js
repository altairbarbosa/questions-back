const express = require('express');
const router = express.Router();
const controller = require('../controllers/respostaUsuario.controller');
const autenticar = require('../middlewares/auth.middleware');

router.post('/', autenticar, controller.responder);
router.get('/historico', autenticar, controller.historico);

module.exports = router;
