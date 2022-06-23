const {Router} = require('express');

const { test,add } = require('../controllers/test');

const router = Router();

router.post('/test',test);
router.post('/add',add);


module.exports = router;