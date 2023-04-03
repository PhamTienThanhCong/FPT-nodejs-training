const OrderController = require('../controllers/HomeController');

const router = require('express').Router();

router.get('/', OrderController.index);

module.exports = router;