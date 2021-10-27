const {Router} = require('express');
const {validarJWT} = require('../middlewares/validar-jwt');
const {getListCustomerPaymentsMethods, createNewCustomer, createPaymentMethod} = require('../controllers/stripe');

const router = Router();

router.post('/getListPayments',validarJWT,getListCustomerPaymentsMethods)
router.post('/createPaymentMethod',validarJWT,createPaymentMethod);


module.exports = router;