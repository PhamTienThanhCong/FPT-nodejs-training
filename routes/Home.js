const homeController = require('../controllers/HomeController');
const router = require('express').Router();

router.get('/', homeController.index);
router.get('/test', homeController.test);

module.exports = router;
