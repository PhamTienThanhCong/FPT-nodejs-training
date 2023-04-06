const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');

const OrderController = {
    getOrders: async(req, res) => {
        try {
            const orders = await Order.find();
            // get user details and add to order
            const ordersWithUserDetails = await Promise.all(orders.map(async(order) => {
                const user = await User.findById(order.userId);
                return {
                    _id: order._id,
                    userId: order.userId,
                    products: order.products,
                    totalPrice: order.totalPrice,
                    status: order.status,
                    createdAt: order.createdAt,
                    user: {
                        username: user.username,
                        email: user.email,
                        phone: user.phone,
                        address: user.address,
                    }
                }
            }));
            return res.status(200).json(ordersWithUserDetails);
        }
        catch(err) {
            return res.status(500).json(err);
        }
    },
    // get user orders
    getUserOrders: async(req, res) => {
        try {
            const orders = await Order.find({userId: req.params.userId});
            return res.status(200).json(orders);
        }
        catch(err) {
            return res.status(500).json(err);
        }
    },
    getOrder: async(req, res) => {
        try {
            const order = await Order.findById(req.params.id);
            // get user and add to order
            const user = await User.findById(order.userId);
            const orderWithUserDetails = {
                _id: order._id,
                userId: order.userId,
                products: order.products,
                totalPrice: order.totalPrice,
                status: order.status,
                createdAt: order.createdAt,
                user: {
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                }
            }
            return res.status(200).json(orderWithUserDetails);
        }
        catch(err) {
            return res.status(500).json(err);
        }
    },
    createOrder: async(req, res) => {
        try {
            const user = await User.findById(req.params.userId);
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

            const newOrder = new Order({
                    userId: user.id,
                    products: productsWithDetails,
                    totalPrice: req.body.totalPrice,
                });
            await newOrder.save();
            return res.status(200).json(newOrder);
        }
        catch(err) {
            // console.log(err);
            return res.status(500).json(err);
        }
    },
    updateOrder: async(req, res) => {
        try {
            const order = await Order.findById(req.params.id);

            if(req.body.status) {
                order.status = req.body.status;
            }
            await order.save();
            return res.status(200).json(order);
        }
        catch(err) {
            return res.status(500).json(err);
        }
    }

}

module.exports = OrderController;