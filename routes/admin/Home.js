const HomeController = require('../../controllers/admin/HomeController');

const router = require('express').Router();

//get orders
router.get('/', HomeController.index);

module.exports = router;