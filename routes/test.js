const {Router} = require('express');

const { test } = require('../controllers/test');

const router = Router();

router.post('/test',test);


module.exports = router;