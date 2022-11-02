const { nuevoProducto, modificarProducto } = require('../controllers/productos');
const {validarJWT} = require('../middlewares/validar-jwt');
const {Router} = require('express');

const router = Router();

router.post('/modificarProducto',validarJWT,modificarProducto);
router.post('/nuevoProducto',    validarJWT,nuevoProducto);

module.exports = router;