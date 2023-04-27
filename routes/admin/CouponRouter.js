const CouponController = require('../../controllers/admin/CouponController');

const router = require('express').Router();

//get orders
router.get('/', CouponController.getCoupons);
router.get('/add', CouponController.createCouponView);
router.post('/create', CouponController.createCoupon);
router.get('/edit/:id', CouponController.editCouponView);
router.post('/update/:id', CouponController.updateCoupon);
router.get('/delete/:id', CouponController.deleteCoupon);

module.exports = router;