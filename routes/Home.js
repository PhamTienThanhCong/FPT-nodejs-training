const HomeController = require('../controllers/HomeController');
const AuthController = require('../controllers/AuthController');

const router = require('express').Router();

router.get('/', HomeController.index);
router.get('/category/:id', HomeController.category);
router.get('/contact', HomeController.contact);
router.get('/product/:id', HomeController.product);
router.get('/products', HomeController.productList);

module.exports = router;