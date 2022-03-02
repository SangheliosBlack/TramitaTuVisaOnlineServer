const {Router} = require('express');
const {validarJWT} = require('../middlewares/validar-jwt');

const controller = require('../controllers/twilio');
const router = Router();

router.get('/testTwilio',validarJWT,controller.twilioTest);
router.post('/enviarSMS',validarJWT,controller.enviarSms);
router.post('/verificarSms',validarJWT,controller.verificarSms);

module.exports = router;