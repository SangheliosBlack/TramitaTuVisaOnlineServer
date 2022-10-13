const {Router} = require('express');
const {validarJWT} = require('../middlewares/validar-jwt');
const {obtenerProductosTienda,searchOne,obtenerTienda, verTodoTiendas, nuevaTienda, modificarHorarioTienda, modificarAniversario, modificarNombreTienda, modificarStatus, construirPantallaPrincipal, construirPantallaPrincipalCategorias, construirPantallaPrincipalTiendas, construirPantallaPrincipalProductos, obtenerProductosCategoria, verTodoProductos, busqueda, crearPedido, lista_pedidos, autoImpresion, macChangue, confirmarPedidoRepartidor, confirmarPedidoRestaurante, confirmarPedidoCliente } = require('../controllers/tiendas');

const router = Router();

router.post('/obtenerTienda',validarJWT,obtenerTienda);

router.post('/nuevaTienda',validarJWT,nuevaTienda);
router.post('/modificarNombre',validarJWT,modificarNombreTienda);
router.post('/modificarHorario',validarJWT,modificarHorarioTienda);
router.post('/modificarAniversario',validarJWT,modificarAniversario);
router.post('/modificarStatus',validarJWT,modificarStatus);

router.post('/getTienda',validarJWT,searchOne);

router.post('/obtenerProductosTienda',validarJWT,obtenerProductosTienda);

/*GET*/

router.get('/construirPantallaPrincipalCategorias',validarJWT,construirPantallaPrincipalCategorias);
router.get('/construirPantallaPrincipalTiendas',validarJWT,construirPantallaPrincipalTiendas);
router.get('/construirPantallaPrincipalProductos',validarJWT,construirPantallaPrincipalProductos);


router.post('/obtenerProductosCategoria',validarJWT,obtenerProductosCategoria);
router.get('/verTodoTiendas',validarJWT,verTodoTiendas);
router.get('/verTodoProductos',validarJWT,verTodoProductos);


router.post('/busqueda',validarJWT,busqueda);

router.post('/crearPedido',validarJWT,crearPedido);

router.post('/pedidos',validarJWT,lista_pedidos);

router.post('/autoImpresion',validarJWT,autoImpresion);

router.post('/macChangue',validarJWT,macChangue);

router.post('/confirmarPedidoRepartidor',validarJWT,confirmarPedidoRepartidor);
router.post('/confirmarPedidoCliente',validarJWT,confirmarPedidoCliente);

router.post('/confirmarPedidoRestaurante',validarJWT,confirmarPedidoRestaurante);



module.exports = router;