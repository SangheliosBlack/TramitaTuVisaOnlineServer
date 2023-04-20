const validarCampos = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const controller = require('../controllers/auth');
const { check } = require('express-validator');
const {Router} = require('express');
const upload = require("../multer");
const router = Router();

router.post('/nuevoUsuario',[

    check('nombre','El nombre es obligatorio').trim().not().isEmpty().custom(async(nombre,{req})=>{
        
        const myArray = nombre.split(' ');

        if(myArray.length <= 2 ){

            throw new Error('Formato nombre completo incorrecto')
        
        }

    }),
    check('contrasena').trim().isLength({min:6,max:16}).withMessage('Contraseña minimo 6 caracteres').custom(async(contrasena,{req})=>{
 
        const confirmar_contrasena = req.body.confirmar_contrasena;
 
        if(contrasena !== confirmar_contrasena ){
        
            throw new Error('Las contraseñas no coinciden');
        
        }

    }),
    check('correo','Correo no valido').trim().isEmail(),
    validarCampos
],controller.crearUsuario);

router.post('/iniciarUsuario',[
    check('contrasena','La contraseña es obligatoria').not().isEmpty(),
    check('correo','Correo no valido').isEmail(),
    validarCampos
],controller.iniciarUsuario);

router.post('/iniciarUsuarioTelefono',controller.iniciarUsuarioTelefono);

router.get('/renovarCodigo',validarJWT,controller.renovarToken);

router.get('/revisarEstado',validarJWT,controller.revisarEstado);

module.exports = router;