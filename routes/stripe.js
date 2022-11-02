const controller = require('../controllers/stripe');
const {validarJWT} = require('../middlewares/validar-jwt');
const {Router} = require('express');

const router = Router();

router.get('/obtenerCliente',               validarJWT,controller.obtenerCliente);

router.post('/actualizarPagoPredeterminado',controller.updateCustomerPaymethDefault);
router.post('/obtenerTarjetas',             validarJWT,controller.getListCustomerPaymentsMethods)
router.post('/nuevoMetodo',                 validarJWT,controller.createPaymentMethod);
router.post('/eliminarMetodoPago',          controller.deletePaymethMethod);

module.exports = router;