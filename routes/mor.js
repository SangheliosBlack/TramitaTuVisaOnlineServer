const controller = require("../controllers/mor");
const {validarJWT} = require('../middlewares/validar-jwt');
const {Router} = require('express');

const router = Router();

router.post('/obtenerListadoAmigos',validarJWT,controller.obtenerListadoAmigos);
router.get('/obtenerEventos',controller.obtenerEventos);
router.post('/agregarAmigo',controller.agregarAmigos);
router.post('/crearNuevoMesa',controller.crearNuevoMesa);


module.exports = router;
