const {Router} = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const controller = require('../controllers/usuarios');

const upload = require("../multer");

const router = Router();

router.get('/',validarJWT,controller.getUsuarios);

router.post('/updateDireccionFavorita',validarJWT,controller.updateDireccionFavorita);

router.post('/modificarTiendaFavorita',validarJWT,controller.modificarTiendaFavorita);

router.post('/guardarFotoPerfil',validarJWT,upload.single("photo"),controller.guardarFotoPerfil)
router.post('/modificarNombreUsuario',validarJWT,controller.modificarNombreUsuario);
router.post('/modificarNombre',validarJWT,controller.modificarNombre);

router.post('cambiarAvatar',validarJWT,validarJWT,controller.modificarAvatar);
router.post('/agregarProductoCesta',validarJWT,controller.agregarProductoCesta);
router.post('/eliminarCestaProductos',validarJWT,controller.eliminarCestaProductos);
router.post('/eliminarProductoCesta',validarJWT,controller.eliminarProductoCesta);
router.post('/modificarCantidadProductoCesta',validarJWT,controller.modificarCantidadProductoCesta);
router.post('/buscarCodigo',validarJWT,controller.buscarCodigo);

router.get('/ordenes',controller.ordenes);


module.exports = router;