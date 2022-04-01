const Router = require('express');
const {validarJWT} = require('../middlewares/validar-jwt');

const controller = require('../controllers/google');

const router = Router();

router.post('/busqueda',validarJWT,controller.busqueda);
router.post('/sugerencia',validarJWT,controller.sugerencia);
router.post('/busquedaID',validarJWT,controller.busquedaID);

module.exports = router;