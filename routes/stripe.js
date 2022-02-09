const {Router} = require('express');
const {validarJWT} = require('../middlewares/validar-jwt');
const {getListCustomerPaymentsMethods, createNewCustomer, createPaymentMethod, obtenerCliente} = require('../controllers/stripe');

const router = Router();

router.post('/obtenerTarjetas',validarJWT,getListCustomerPaymentsMethods)
router.post('/nuevoMetodo',validarJWT,createPaymentMethod);
router.get('/obtenerCliente',validarJWT,obtenerCliente);


module.exports = router;