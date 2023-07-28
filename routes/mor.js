const controller = require("../controllers/mor");
const {validarJWT} = require('../middlewares/validar-jwt');
const {Router} = require('express');

const router = Router();

router.post('/obtenerListadoAmigos',validarJWT,controller.obtenerListadoAmigos);
router.get('/obtenerEventos',controller.obtenerEventos);
router.post('/agregarAmigo',validarJWT,controller.agregarAmigos);
router.post('/crearNuevoMesa',controller.crearNuevoMesa);
router.post('/crearNuevaReserva',validarJWT,controller.crearNuevaReserva);
router.post('/agregarInvitado',validarJWT,controller.agregarInvitado);
router.post('/eliminarInvitado',validarJWT,controller.eliminarInvitado);
router.post('/revisar_reservacion',validarJWT,controller.revisar_reservacion);


module.exports = router;
