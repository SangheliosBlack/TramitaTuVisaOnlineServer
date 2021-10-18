const {Router, response} = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, renewToken, crearTeammate, updateDireccionFavorita } = require('../controllers/auth');
const validarCampos = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

const upload = require("../multer");



router.post('/new',[
    check('name','El nombre es obligatorio').trim().not().isEmpty(),
    check('password').trim().isLength({min:6,max:16}).withMessage('Contraseña minimo 6 caracteres').custom(async(password,{req})=>{
        const confirmPassword = req.body.confirmPassword;
        if(password !== confirmPassword ){
            console.log(req.body.name);
            throw new Error('Las contraseñas no coinciden');
        }
    }),
    check('email','Email no valido').trim().isEmail(),
    validarCampos
],crearUsuario);

router.post('/login',[
    check('password','La contraseña es obligatoria').not().isEmpty(),
    check('email','Email no valido').isEmail(),
    validarCampos
],loginUsuario);


router.get('/renew',validarJWT,renewToken);

module.exports = router;