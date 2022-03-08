const {Router} = require('express');
const { check } = require('express-validator');
const { crearUsuario, iniciarUsuario, renovarToken, iniciarUsuarioTelefono } = require('../controllers/auth');
const validarCampos = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

const upload = require("../multer");

router.post('/nuevoUsuario',[
    check('nombre','El nombre es obligatorio').trim().not().isEmpty(),
    check('contrasena').trim().isLength({min:6,max:16}).withMessage('Contraseña minimo 6 caracteres').custom(async(contrasena,{req})=>{
        const confirmar_contrasena = req.body.confirmar_contrasena;
        if(contrasena !== confirmar_contrasena ){
            throw new Error('Las contraseñas no coinciden');
        }
    }),
    check('correo','Correo no valido').trim().isEmail(),
    validarCampos
],crearUsuario);

router.post('/iniciarUsuario',[
    check('contrasena','La contraseña es obligatoria').not().isEmpty(),
    check('correo','Correo no valido').isEmail(),
    validarCampos
],iniciarUsuario);

router.post('/iniciarUsuarioTelefono',iniciarUsuarioTelefono);

router.get('/renovarCodigo',validarJWT,renovarToken);

module.exports = router;