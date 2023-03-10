const {validarJWT} = require('../middlewares/validar-jwt');
const controller = require('../controllers/tiendas');
const {Router} = require('express');

const router = Router();

router.get('/construirPantallaPrincipalCategorias',validarJWT,controller.construirPantallaPrincipalCategorias);
router.get('/construirPantallaPrincipalProductos', validarJWT,controller.construirPantallaPrincipalProductos);
router.get('/construirPantallaPrincipalTiendas',   validarJWT,controller.construirPantallaPrincipalTiendas);
router.get('/verTodoProductos',                    validarJWT,controller.verTodoProductos);
router.get('/verTodoTiendas',                      validarJWT,controller.verTodoTiendas);

router.post('/confirmarPedidoRestaurante',validarJWT,controller.confirmarPedidoRestaurante);
router.post('/confirmarPedidoRepartidor', validarJWT,controller.confirmarPedidoRepartidor);
router.post('/obtenerProductosCategoria', validarJWT,controller.obtenerProductosCategoria);
router.post('/confirmarPedidoCliente',    validarJWT,controller.confirmarPedidoCliente);
router.post('/obtenerProductosTienda',    validarJWT,controller.obtenerProductosTienda);
router.post('/modificarAniversario',      validarJWT,controller.modificarAniversario);
router.post('/modificarHorario',          validarJWT,controller.modificarHorarioTienda);
router.post('/modificarNombre',           validarJWT,controller.modificarNombreTienda);
router.post('/modificarStatus',           validarJWT,controller.modificarStatus);
router.post('/obtenerTienda',             validarJWT,controller.obtenerTienda);
router.post('/autoImpresion',             validarJWT,controller.autoImpresion);
router.post('/nuevaTienda',               validarJWT,controller.nuevaTienda);
router.post('/crearPedido',               validarJWT,controller.crearPedido);
router.post('/pedidos',                   validarJWT,controller.lista_pedidos);
router.post('/macChangue',                validarJWT,controller.macChangue);
router.post('/getTienda',                 validarJWT,controller.searchOne);
router.post('/busqueda',                  validarJWT,controller.busqueda);

//lineas_tienda_ropa    

router.post('/agregarNuevoAbono',validarJWT,controller.agregarNuevoAbono);
router.post('/busquedaPrendaSku',validarJWT,controller.busquedaPrendaSku);
router.get('/obtenerApartados',  validarJWT,controller.busquedaApartados);
router.post('/busquedaQRVenta',  validarJWT,controller.busquedaQRVenta);
router.post('/busquedaPrenda',   validarJWT,controller.busquedaPrenda);
router.post('/pedidosTienda',    validarJWT,controller.lista_pedidos_tienda);


//pruebas

router.post('obtenerProductosMasVendidos',validarJWT,controller.obtenerProductosMasVendido);
router.post('obtenerProductosPopular',    validarJWT,controller.obtenerProductosPopulares);
router.post('obtenerTiendaMasVendido'),   validarJWT,controller.obtenerTiendaMasVendido;
router.post('obtenerTiendaPopular'),      validarJWT,controller.obtenerTiendaPopulares;



module.exports = router;