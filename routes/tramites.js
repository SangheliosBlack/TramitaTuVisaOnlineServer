const { validarJWT } = require('../middlewares/validar-jwt');
const controller = require('../controllers/tramitesController');
const express = require('express');
const router = express.Router();
const authContoller = require('../controllers/authController')
const passport = require('passport');
const roleConfig = require('../config/roleConfig');
const checkPermissions = require('../middlewares/checkPermissions');

router.use(passport.authenticate('jwt', { session: false }));

router.post('/nuevoTramite',checkPermissions('read', 'all'),controller.crearNuevoTramite.bind(controller));

module.exports = router;