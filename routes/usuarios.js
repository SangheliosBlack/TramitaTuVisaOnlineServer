const {Router} = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getUsuarios,updateDireccionFavorita, guardarFotoPerfil, modificarTiendaFavorita, ModificarNombreUsuario,ModificarNombre  } = require('../controllers/usuarios');

const upload = require("../multer");

const router = Router();

router.get('/',validarJWT,getUsuarios);

router.post('/updateDireccionFavorita',validarJWT,updateDireccionFavorita);

router.post('/modificarTiendaFavorita',validarJWT,modificarTiendaFavorita);

router.post('/guardarFotoPerfil',validarJWT,upload.single("photo"),guardarFotoPerfil)
router.post('/modificarNombreUsuario',validarJWT,ModificarNombreUsuario);
router.post('/modificarNombre',validarJWT,ModificarNombre);

module.exports = router;