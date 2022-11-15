const {Router} = require('express');

const { test,add, repartidores, pedidosPendientes ,actulizarVentaRepartidor} = require('../controllers/test');

const router = Router();

router.get('/repartidores',repartidores);
router.get('/repartidores',repartidores);
router.get('/pedidos',     pedidosPendientes);
router.post('/test',       test);
router.post('/add',        add);
router.post('/actualizar',actulizarVentaRepartidor)


module.exports = router;