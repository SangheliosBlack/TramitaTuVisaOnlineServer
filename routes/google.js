const Router = require('express');
const {validarJWT} = require('../middlewares/validar-jwt');

const controller = require('../controllers/google');

const router = Router();

router.post('/sugerencia',validarJWT,controller.sugerencia);
router.post('/busquedaID',validarJWT,controller.busquedaID);
router.post('/busqueda',  validarJWT,controller.busqueda);
router.post('/ruta',      validarJWT,controller.ruta);

module.exports = router;