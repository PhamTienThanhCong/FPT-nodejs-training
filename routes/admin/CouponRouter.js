const CouponController = require('../../controllers/admin/CouponController');

const router = require('express').Router();

//get orders
router.get('/', CouponController.getCoupons);
router.get('/add', CouponController.createCouponView);
router.post('/create', CouponController.createCoupon);

module.exports = router;