const Order = require('../../models/Order');
const Product = require('../../models/Product');
const Category = require('../../models/Category');
const Coupon = require('../../models/Coupon');
const User = require('../../models/User');

const HomeController = {
    index : async (req, res) => {
        try {
            const users = await User.find();
            const orders = await Order.find().sort({ createdAt: -1 });
            const products = await Product.find();
            const coupons = await Coupon.find();

            let totalPriceSales = 0;
            let totalPriceRefund = 0;
            let totalPriceSuccess = 0;
            let totalSales = orders.length;
            let totalRefund = 0;
            let totalUserBlocked = 0;
            let totalUser = users.length;
            let totalProduct = products.length;
            let totalTypeCoupon = coupons.length;
            let totalCouponUsage = 0;
            let totalCouponUnaged = 0;
            let totalCouponExpired = 0;
            let totalCouponWaiting = 0;
            let totalViewProduct = 0;
            let totalAddToCart = 0;

            orders.forEach(order => {
                order.products.forEach(productOrder => {
                    totalPriceSales += productOrder.quantity * productOrder.price;
                    if ( order.status == 'Refunded' || order.status == 'Returning') {
                        totalPriceRefund += productOrder.quantity * productOrder.price;
                        totalRefund ++;
                    }
                    else if (order.status == 'Done') {
                        totalPriceSuccess += productOrder.quantity * productOrder.price;
                    }
                })
            })

            let totalDiscount = 0;
            orders.forEach(order => {
                if (order.coupon) {
                    coupons.forEach(coupon => {
                        if (coupon.CouponCode == order.coupon) {
                            totalDiscount += order.totalPrice / (1 - coupon.Discount / 100);
                            return;
                        }
                    })
                }
            })

            users.forEach(user => {
                if (user.block == true) {
                    totalUserBlocked ++;
                }
            })

            coupons.forEach(coupon => {
                totalCouponUnaged += coupon.numberOfUsage - coupon.numberOfUsageLeft;
                if (coupon.expiryDate < Date.now() || coupon.Status == 'Inactive') {
                    totalCouponExpired += coupon.numberOfUsageLeft;
                }
                else if (coupon.Validity < Date.now() && coupon.expiryDate > Date.now()) {
                    totalCouponUsage += coupon.numberOfUsageLeft;
                } else {
                    totalCouponWaiting += coupon.numberOfUsageLeft;
                }
            })
            
            products.forEach(product => {
                totalViewProduct += product.views;
                totalAddToCart += product.numberAddedToCart;
            })
            let data = {
                totalPriceSales,
                totalPriceRefund,
                totalPriceSuccess,
                totalSales,
                totalRefund,
                totalUserBlocked,
                totalUser,
                totalProduct,
                totalTypeCoupon,
                totalCouponUsage,
                totalCouponUnaged,
                totalCouponExpired,
                totalCouponWaiting,
                totalViewProduct,
                totalAddToCart,
            }
            return res.render('admin/index', { data });
        }
        catch(err) {
            return res.status(500).json(err);
        }
    }
}

module.exports = HomeController;