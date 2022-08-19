const {Router} = require('express');
const{validarJWT} = require ('../middlewares/validar-jwt');

const controller = require('../controllers/repartidor');

const router = Router();

router.post('/test',controller.obtenerEnvio);

module.exports = router;
