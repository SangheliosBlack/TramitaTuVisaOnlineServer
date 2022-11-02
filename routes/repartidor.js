const controller = require('../controllers/repartidor');
const{validarJWT} = require ('../middlewares/validar-jwt');
const {Router} = require('express');
const router = Router();

router.post('/confirmarPedidoEntregado',controller.confirmarPedidoEntregado);
router.post('/transitoUsuarioOff',      controller.transitoUsuarioOff);
router.post('/envioPendiente',          controller.buscarEnvioPendiente);
router.post('/enviosMomento',           controller.obtenerEnviosMomento);
router.post('/transitoUsuario',         controller.transitoUsuario);
router.post('/desconectar',             controller.desconectar);
router.post('/envios',                  controller.obtenerEnvios);
router.post('/conectar',                controller.conectar);

module.exports = router;
