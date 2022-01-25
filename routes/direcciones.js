const {Router} = require('express');
const {validarJWT} = require('../middlewares/validar-jwt');
const {getDirecciones, nuevaDireccion, searchOne, updateIcon, updateName} = require('../controllers/direcciones');

const router = Router();

router.get('/',validarJWT,getDirecciones);
router.post('/nuevaDireccion',validarJWT,nuevaDireccion);
router.post('/search',validarJWT,searchOne);
router.post('/updateIcon',validarJWT,updateIcon);
router.post('/updateName',validarJWT,updateName);

module.exports = router;