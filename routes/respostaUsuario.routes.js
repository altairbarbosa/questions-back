const express = require("express");
const router = express.Router();
const respostasController = require("../controllers/resposta.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/", authMiddleware, respostasController.salvarRespostasUsuario);
router.get("/resultado/:questionario_id", authMiddleware, respostasController.resultado);

module.exports = router;
