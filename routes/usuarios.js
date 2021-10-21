const {Router} = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getUsuarios,updateDireccionFavorita, guardarFotoPerfil, modificarTiendaFavorita  } = require('../controllers/usuarios');

const upload = require("../multer");

const router = Router();

router.get('/',validarJWT,getUsuarios);

router.post('/updateDireccionFavorita',validarJWT,updateDireccionFavorita);

router.post('/modificarTiendaFavorita',validarJWT,modificarTiendaFavorita);

router.post('/guardarFotoPerfil',validarJWT,upload.single("photo"),guardarFotoPerfil)

module.exports = router;