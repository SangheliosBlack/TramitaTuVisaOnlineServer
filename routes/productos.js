const {Router} = require('express');
const {validarJWT} = require('../middlewares/validar-jwt');
const { nuevoProducto, modificarProducto } = require('../controllers/productos');

const router = Router();

router.post('/nuevoProducto',validarJWT,nuevoProducto);

router.post('/modificarProducto',validarJWT,modificarProducto);

module.exports = router;