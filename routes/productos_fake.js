const {Router} = require('express');

const {nuevoProductoFake} = require ('../controllers/productos_fake');

const router = Router();

router.post('/nuevo',nuevoProductoFake);S

module.exports = router;