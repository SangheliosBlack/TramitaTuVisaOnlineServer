const { Router } = require("express");
const { nuevoComentario, modificarComentario, reacionComentario, destacarComentario, noDestacarComentario, eliminarComentario } = require("../controllers/comentarios");
const {validarJWT} = require('../middlewares/validar-jwt');
const router = Router();

router.post('/destacarComentario',validarJWT,destacarComentario);

router.post('/nuevoComentario',validarJWT,nuevoComentario);
router.post('/modificarComentario',validarJWT,modificarComentario);
router.post('/reaccionComentario',validarJWT,reacionComentario);
router.post('/noDestacarComentario',validarJWT,noDestacarComentario);
router.post('/eliminarComentario',validarJWT,eliminarComentario);

module.exports = router;