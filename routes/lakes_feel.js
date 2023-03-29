const { validarJWT } = require('../middlewares/validar-jwt');
const controller = require('../controllers/lakes_feel');

const {Router} = require('express');
const router = Router();

router.post('/obtenerPerfilQr',controller.obtenerPerfilQr);
router.post('/agregarAbonoCliente',controller.agregarAbonoCliente);


module.exports = router;