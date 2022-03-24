const Router = require('express');
const {validarJWT} = require('../middlewares/validar-jwt');

const controller = require('../controllers/google');

const router = Router();

router.post('/busqueda',controller.busqueda);

module.exports = router;