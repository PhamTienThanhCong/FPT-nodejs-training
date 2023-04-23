const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');

var paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AY-1IurK4tN0mv18nYE-3s44jVwsRku4uJ9Bnq2F4KcSFq_XJTBZFBCNaewZyS-RxoIDSSdrViUDIboO',
    'client_secret': 'EMnMwfIbscWaHqe3cJAzrr-WNWTI3iyBX-dC6mcSwwBbYKMNUCY6MWeZKIhVQoOf8Ukg11OoKxutiL42'
});

const addToOrderFunction = async (req, res, id, totalPrice, userProfile, paymentType) => {
    const user = await User.findById(id);
    const cart = await Cart.findById(user.cart);
    const products = cart.products;
    cart.products = [];
    await cart.save();
    // map products to get product details
    const productsWithDetails = await Promise.all(products.map(async (product) => {
        const productDetails = await Product.findById(product.productId);
        return {
            productId: product.productId,
            quantity: product.quantity,
            name: productDetails.name,
            price: productDetails.price,
            image: productDetails.image,
        }
    }));
    const newOrder = new Order({
        userId: user.id,
        userProfile: userProfile,
        products: productsWithDetails,
        totalPrice: totalPrice,
        paymentType : paymentType,
    });
    await newOrder.save();
}

const CartController = {
    cart: async (req, res) => {
        var sess = req.session;
        const id = sess.username.id;
        const user = await User.findById(id);
        const cart = await Cart.findById(user.cart).populate('products.productId');
        let total = 0;
        for (const element of cart.products) {
            total += element.productId.price * element.quantity;
        }
        res.render('pages/cart', { cart, total });
    },
    addToCart: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            const productId = req.params.productId;
            const newQuantity = req.body.quantity;
            const cart = await Cart.findById(user.cart);
            let products = cart.products;

            let productExists = true;

            for (const element of products) {
                if (element.productId == productId) {
                    productExists = false;
                    element.quantity = newQuantity;
                    break;
                }
            }

            if (productExists) {
                products.push({
                    productId: productId,
                    quantity: newQuantity
                });
                // update numberAddedToCart
                Product.findByIdAndUpdate(productId, { $inc: { numberAddedToCart: 1 } }, { new: true }, (err, doc) => {
                    if (err) {
                        console.log("Something wrong when updating data!");
                    }
                }
                );
            }

            if (newQuantity == 0) {
                products = products.filter(element => element.productId != productId);
            }

            cart.products = products;

            await cart.save();

            // return res.status(200).json(cart);
            res.redirect('/cart');
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    removeFromCart: async (req, res) => {
        try {
            var sess = req.session;
            const id = sess.username.id;
            const user = await User.findById(id);
            const cart = await Cart.findById(user.cart);
            cart.products = [];
            await cart.save();
            res.redirect('/cart');
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    checkout: async (req, res) => {
        var sess = req.session;
        const id = sess.username.id;
        const user = await User.findById(id);
        const cart = await Cart.findById(user.cart).populate('products.productId');
        let total = 0;
        for (const element of cart.products) {
            total += element.productId.price * element.quantity;
        }
        res.render('pages/checkout', { cart, total, id });
    },
    checkoutPost: async (req, res) => {
        try {
            var sess = req.session;
            const id = sess.username.id;
            const payment = req.body.payment;
            const totalPrice = req.body.totalPrice;
            const userProfile = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                note: req.body.note,
            }
            if (payment == 'paypal') {
                // save userProfile to session
                sess.userProfile = userProfile;
                // save totalPrice to session
                sess.totalPrice = totalPrice;
                return res.redirect('/pay');
            }
            await addToOrderFunction(req, res, id, totalPrice, userProfile, "Cash on delivery");
            res.redirect('/checkoutSuccess');
        }
        catch (err) {
            // console.log(err);
            return res.status(500).json(err);
        }
    },
    checkoutSuccess: async (req, res) => {
        res.render('pages/checkoutSuccess');
    },
    orderHistory: async (req, res) => {
        var sess = req.session;
        const id = sess.username.id;
        const data = await Order.find({ userId: id }).sort({ createdAt: -1 });
        res.render('pages/orderHistory', { data });
    },
    pay: async (req, res) => {
        try {
            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:8000/success",
                    "cancel_url": "http://localhost:8000/checkout"
                },
                "transactions": [{

                    "amount": {
                        "currency": "USD",
                        "total": 1000000
                    },
                    "description": "This is the payment description.",
                }]
            };

            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    throw error;
                } else {
                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel === 'approval_url') {
                            res.redirect(payment.links[i].href);
                        }
                    }

                }
            });
        }
        catch (err) {
            console.log(err)
        }
    },
    success: async (req, res) => {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        // get userProfile from session
        var sess = req.session;
        const id = sess.username.id;
        const userProfile = sess.userProfile;
        const totalPrice = sess.totalPrice;
        // remove userProfile, totalprice from session
        delete sess.userProfile;
        delete sess.totalPrice;

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": totalPrice
                }
            }]
        };
        paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                await addToOrderFunction(req, res, id, totalPrice, userProfile, "Paypal");

                res.redirect('http://localhost:8000/checkoutSuccess');
            }
        });
    }

}

module.exports = CartController;