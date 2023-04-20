const OrderController = require('../../controllers/admin/OrderController');

const router = require('express').Router();

//get orders
router.get('/', OrderController.getOrders);

//get order
router.get('/:id', OrderController.getOrder);

//update order
router.get('/:id/update', OrderController.updateOrder);

module.exports = router;