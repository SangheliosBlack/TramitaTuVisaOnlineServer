const {Router} = require('express');
const {validarJWT} = require('../middlewares/validar-jwt');
const {getListCustomerPaymentsMethods, createNewCustomer} = require('../controllers/stripe');

const router = Router();

router.post('/getListPayments',validarJWT,getListCustomerPaymentsMethods)
router.post('/createCustomer',validarJWT,createNewCustomer);


module.exports = router;