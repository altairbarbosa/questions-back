const express = require('express');
const router = express.Router();
const controller = require('../controllers/tentativa.controller');
const autenticar = require('../middlewares/auth.middleware');

router.post('/', autenticar, controller.iniciar);
router.patch('/:id/finalizar', autenticar, controller.finalizar);
router.get('/usuario', autenticar, controller.listarPorUsuario);

module.exports = router;
