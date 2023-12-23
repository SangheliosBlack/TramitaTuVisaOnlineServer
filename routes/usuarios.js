const { validarJWT } = require('../middlewares/validar-jwt');
const controller = require('../controllers/usuarios');
const {Router} = require('express');

const upload = require("../multer");

const router = Router();

router.get('/ordenes',validarJWT,controller.ordenes);

router.post('/modificarCantidadProductoCesta',validarJWT,controller.modificarCantidadProductoCesta);
router.post('/modificarNombreUsuario',        validarJWT,controller.modificarNombreUsuario);
router.post('/eliminarCestaProductos',        validarJWT,controller.eliminarCestaProductos);
router.post('/eliminarProductoCesta',         validarJWT,controller.eliminarProductoCesta);
router.post('/agregarProductoCesta',          validarJWT,controller.agregarProductoCesta);
router.post('/guardarFotoPerfil',             validarJWT,upload.single("photo"),controller.guardarFotoPerfil)
router.post('/modificarNombre',               validarJWT,controller.modificarNombre);
router.post('cambiarAvatar',                  validarJWT,validarJWT,controller.modificarAvatar);
router.post('/buscarCodigo',                  validarJWT,controller.buscarCodigo);

module.exports = router;