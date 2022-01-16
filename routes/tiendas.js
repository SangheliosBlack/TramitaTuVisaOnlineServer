const {Router} = require('express');
const {validarJWT} = require('../middlewares/validar-jwt');
const {searchOne, getTiendas, nuevaTienda, modificarHorarioTienda, modificarAniversario, modificarNombreTienda, modificarStatus, construirPantallaPrincipal, construirPantallaPrincipalCategorias, construirPantallaPrincipalTiendas, construirPantallaPrincipalProductos } = require('../controllers/tiendas');

const router = Router();

router.get('/',validarJWT,getTiendas);

router.post('/nuevaTienda',validarJWT,nuevaTienda);
router.post('/modificarNombre',validarJWT,modificarNombreTienda);
router.post('/modificarHorario',validarJWT,modificarHorarioTienda);
router.post('/modificarAniversario',validarJWT,modificarAniversario);
router.post('/modificarStatus',validarJWT,modificarStatus);

router.post('/getTienda',validarJWT,searchOne);

/*GET*/

router.get('/construirPantallaPrincipalCategorias',validarJWT,construirPantallaPrincipalCategorias);
router.get('/construirPantallaPrincipalTiendas',validarJWT,construirPantallaPrincipalTiendas);
router.get('/construirPantallaPrincipalProductos',validarJWT,construirPantallaPrincipalProductos);


module.exports = router;