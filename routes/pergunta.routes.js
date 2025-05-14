const express = require('express');
const router = express.Router();
const controller = require('../controllers/pergunta.controller');
const autenticar = require('../middlewares/auth.middleware');

router.get('/', controller.listar);
router.get('/:id', controller.verPorId);
router.delete('/:id', autenticar, controller.deletar);
router.put('/:id', autenticar, controller.editar);

module.exports = router;
