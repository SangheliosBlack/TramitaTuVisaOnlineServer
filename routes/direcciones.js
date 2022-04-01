const {Router} = require('express');
const {validarJWT} = require('../middlewares/validar-jwt');
const {getDirecciones, nuevaDireccion, searchOne, eliminarDireccion, direccionPredeterminada} = require('../controllers/direcciones');

const router = Router();

router.get('/',validarJWT,getDirecciones);
router.post('/nuevaDireccion',validarJWT,nuevaDireccion);
router.post('/search',validarJWT,searchOne);
router.post('/eliminar',validarJWT,eliminarDireccion);

router.post('/predeterminada',validarJWT,direccionPredeterminada);

module.exports = router;