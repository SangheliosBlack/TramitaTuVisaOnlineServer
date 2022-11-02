const {validarJWT} = require('../middlewares/validar-jwt');
const controller = require("../controllers/comentarios");
const { Router } = require("express");
const router = Router();

router.post('/destacarComentario',  validarJWT,controller.destacarComentario);

router.post('/noDestacarComentario',validarJWT,controller.noDestacarComentario);
router.post('/modificarComentario', validarJWT,controller.modificarComentario);
router.post('/eliminarComentario',  validarJWT,controller.eliminarComentario);
router.post('/reaccionComentario',  validarJWT,controller.reacionComentario);
router.post('/nuevoComentario',     validarJWT,controller.nuevoComentario);

module.exports = router;