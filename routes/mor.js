const controller = require("../controllers/mor");
const {validarJWT} = require('../middlewares/validar-jwt');
const {Router} = require('express');

const router = Router();

router.get('/obtenerEventos',controller.obtenerEventos);

module.exports = router;
