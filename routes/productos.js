const {Router} = require('express');
const {validarJWT} = require('../middlewares/validar-jwt');
const { nuevoProducto } = require('../controllers/productos');

const router = Router();

router.post('/nuevoProducto',validarJWT,nuevoProducto);

module.exports = router;