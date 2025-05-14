const express = require("express");
const router = express.Router();
const respostaUsuarioController = require("../controllers/respostaUsuario.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/", authMiddleware, respostaUsuarioController.responder);
router.post("/lote", authMiddleware, respostaUsuarioController.responderEmLote);
router.get("/historico", authMiddleware, respostaUsuarioController.historico);

module.exports = router;
