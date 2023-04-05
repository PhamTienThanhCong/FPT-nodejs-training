const OrderController = require('../controllers/HomeController');

const router = require('express').Router();

router.get('/', OrderController.index);
router.get('/category/:id', OrderController.category);
router.get('/contact', OrderController.contact);
router.get('/product', OrderController.product);
router.get('/cart', OrderController.cart);
router.get('/checkout', OrderController.checkout);

module.exports = router;