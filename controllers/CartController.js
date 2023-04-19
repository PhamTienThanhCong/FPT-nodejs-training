const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');

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

            for(const element of products) {
                if(element.productId == productId) {
                    productExists = false;
                    element.quantity += newQuantity;
                    break;
                }
            }

            if(productExists) {
                products.push({
                    productId: productId,
                    quantity: newQuantity
                });
            }

            if(newQuantity == 0) {
                products = products.filter(element => element.productId != productId);
            }

            cart.products = products;

            await cart.save();

            // return res.status(200).json(cart);
            res.redirect('/cart');
        }
        catch(err) {
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
        catch(err) {
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

            const user = await User.findById(id);
            const cart = await Cart.findById(user.cart);
            const products = cart.products;
            cart.products = [];
            await cart.save();
            // map products to get product details
            const productsWithDetails = await Promise.all(products.map(async(product) => {
                const productDetails = await Product.findById(product.productId);
                return {
                    productId: product.productId,
                    quantity: product.quantity,
                    name: productDetails.name,
                    price: productDetails.price,
                    image: productDetails.image,
                }
            }));
            const userProfile = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                note: req.body.note,
            }
            const newOrder = new Order({
                    userId: user.id,
                    userProfile: userProfile,
                    products: productsWithDetails,
                    totalPrice: req.body.totalPrice,
                });
            await newOrder.save();
            res.redirect('/checkoutSuccess');
        }
        catch(err) {
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
        const data = await Order.find({userId: id}).sort({createdAt: -1});
        res.render('pages/orderHistory', { data });
    },

}

module.exports = CartController;