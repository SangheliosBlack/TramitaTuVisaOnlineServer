const {Router} = require('express');
const {validarJWT} = require('../middlewares/validar-jwt');
const {obtenerProductosTienda,searchOne,obtenerTienda, verTodo, nuevaTienda, modificarHorarioTienda, modificarAniversario, modificarNombreTienda, modificarStatus, construirPantallaPrincipal, construirPantallaPrincipalCategorias, construirPantallaPrincipalTiendas, construirPantallaPrincipalProductos, obtenerProductosCategoria } = require('../controllers/tiendas');

const router = Router();

router.get('/obtenerTienda',validarJWT,obtenerTienda);

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


router.post('/obtenerProductosCategoria',validarJWT,obtenerProductosCategoria);
router.get('/verTodo',validarJWT,verTodo);


module.exports = router;