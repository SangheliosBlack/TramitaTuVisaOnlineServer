const {Router} = require('express');
const {validarJWT} = require('../middlewares/validar-jwt');

const controller = require('../controllers/twilio');
const router = require('./productos');

router.get('/testTwilio',controller.twilioTest);
router.post('/enviarSMS',controller.enviarSms);
router.post('/verificarSms',controller.verificarSms);

module.exports = router;