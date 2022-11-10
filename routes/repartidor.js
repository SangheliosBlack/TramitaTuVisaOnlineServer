const controller = require('../controllers/repartidor');
const{validarJWT} = require ('../middlewares/validar-jwt');
const {Router} = require('express');
const router = Router();

router.post('/confirmarPedidoEntregado',validarJWT,controller.confirmarPedidoEntregado);
router.post('/transitoUsuarioOff',      validarJWT,controller.transitoUsuarioOff);
router.post('/envioPendiente',          validarJWT,controller.buscarEnvioPendiente);
router.post('/enviosMomento',           validarJWT,controller.obtenerEnviosMomento);
router.post('/transitoUsuario',         validarJWT,controller.transitoUsuario);
router.post('/desconectar',             validarJWT,controller.desconectar);
router.post('/envios',                  validarJWT,controller.obtenerEnvios);
router.post('/conectar',                validarJWT,controller.conectar);

module.exports = router;
