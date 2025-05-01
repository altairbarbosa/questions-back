const express = require('express');
const router = express.Router();
const controller = require('../controllers/questionario.controller');
const autenticar = require('../middlewares/auth.middleware');

router.get('/publicos', controller.listarPublicos);
router.post('/', autenticar, controller.criar);

module.exports = router;
