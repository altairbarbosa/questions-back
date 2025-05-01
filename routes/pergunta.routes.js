const express = require('express');
const router = express.Router();
const controller = require('../controllers/pergunta.controller');
const autenticar = require('../middlewares/auth.middleware'); // se quiser proteger

router.get('/', controller.listar);
router.get('/:id', controller.verPorId);
router.post('/', autenticar, controller.criar);  // requer login
router.delete('/:id', autenticar, controller.deletar);

module.exports = router;
