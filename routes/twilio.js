const controller = require('../controllers/twilio');
const {Router} = require('express');

const router = Router();

router.get('/testTwilio',   controller.twilioTest);
router.post('/enviarSMS',   controller.enviarSms);
router.post('/verificarSms',controller.verificarSms);

module.exports = router;