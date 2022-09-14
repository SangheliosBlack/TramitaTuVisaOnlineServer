const {Router} = require('express');
const{validarJWT} = require ('../middlewares/validar-jwt');

const controller = require('../controllers/repartidor');

const router = Router();

router.post('/envios',controller.obtenerEnvios);
router.post('/enviosMomento',controller.obtenerEnviosMomento);
router.post('/conectar',controller.conectar);
router.post('/desconectar',controller.desconectar);

router.post('/envioPendiente',controller.buscarEnvioPendiente);

router.post('/transitoUsuario',controller.transitoUsuario);

router.post('/confirmarPedidoEntregado',controller.confirmarPedidoEntregado);

module.exports = router;
