const CartController = require('../controllers/CartController');

const router = require('express').Router();

//get cart
router.get('/:id', CartController.getCartByUserId);

//add to cart
router.post('/:id/:productId', CartController.addToCart);

//remove from cart
router.delete('/:id/:productId', CartController.removeFromCart);

//clear cart
router.delete('/:id', CartController.clearCart);

module.exports = router;
