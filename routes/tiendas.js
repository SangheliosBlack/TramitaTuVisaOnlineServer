const {Router} = require('express');
const {validarJWT} = require('../middlewares/validar-jwt');
const {searchOne, getTiendas, nuevaTienda, modificarHorarioTienda, modificarAniversario } = require('../controllers/tiendas');

const router = Router();

router.get('/',validarJWT,getTiendas);
router.post('/nuevaTienda',validarJWT,nuevaTienda);
router.post('/getTienda',validarJWT,searchOne);
router.post('/modificarHorario',validarJWT,modificarHorarioTienda);
router.post('/modificarAniversario',validarJWT,modificarAniversario);


module.exports = router;