const CartController = require('../controllers/CartController');

const router = require('express').Router();

router.get('/cart', CartController.cart);
router.post('/cart/:id/:productId', CartController.addToCart);
router.get('/cart/clear', CartController.removeFromCart);
router.get('/checkout', CartController.checkout);
router.post('/checkout', CartController.checkoutPost);
router.get('/checkoutSuccess', CartController.checkoutSuccess);
router.get('/order-history', CartController.orderHistory);

router.get('/pay', CartController.pay);
router.get('/success', CartController.success);


module.exports = router;