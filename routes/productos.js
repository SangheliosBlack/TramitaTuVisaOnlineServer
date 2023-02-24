const { nuevoProducto, modificarProducto, buscarSku,eliminarProducto } = require('../controllers/productos');
const {validarJWT} = require('../middlewares/validar-jwt');
const {Router} = require('express');

const router = Router();

router.post('/modificarProducto',validarJWT,modificarProducto);
router.post('/nuevoProducto',    validarJWT,nuevoProducto);
router.post('/buscarSku',buscarSku);
router.post('/eliminarProducto',validarJWT,eliminarProducto);

module.exports = router;