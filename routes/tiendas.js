const {Router} = require('express');
const {validarJWT} = require('../middlewares/validar-jwt');
const {obtenerProductosTienda,searchOne, obtenerTiendas, nuevaTienda, modificarHorarioTienda, modificarAniversario, modificarNombreTienda, modificarStatus, construirPantallaPrincipal, construirPantallaPrincipalCategorias, construirPantallaPrincipalTiendas, construirPantallaPrincipalProductos } = require('../controllers/tiendas');

const router = Router();

router.get('/obtenerTienda',validarJWT,obtenerTiendas);

router.post('/nuevaTienda',validarJWT,nuevaTienda);
router.post('/modificarNombre',validarJWT,modificarNombreTienda);
router.post('/modificarHorario',validarJWT,modificarHorarioTienda);
router.post('/modificarAniversario',validarJWT,modificarAniversario);
router.post('/modificarStatus',validarJWT,modificarStatus);

router.post('/getTienda',validarJWT,searchOne);

router.get('/obtenerProductosTienda',validarJWT,obtenerProductosTienda);

/*GET*/

router.get('/construirPantallaPrincipalCategorias',validarJWT,construirPantallaPrincipalCategorias);
router.get('/construirPantallaPrincipalTiendas',validarJWT,construirPantallaPrincipalTiendas);
router.get('/construirPantallaPrincipalProductos',validarJWT,construirPantallaPrincipalProductos);


module.exports = router;