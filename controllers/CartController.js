const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');


const CartController = {
    getCart: async(req, res) => {
        try {
            const cart = await Cart.findById(req.params.id);
            return res.status(200).json(cart);
        }
        catch(err) {
            return res.status(500).json(err);
        }
    },
    //get cart by user id
    getCartByUserId: async(req, res) => {
        try {
            const user = await User.findById(req.params.id);
            const cart = await Cart.findById(user.cart);
            return res.status(200).json(cart);
        }
        catch(err) {
            return res.status(500).json(err);
        }
    },
    addToCart: async(req, res) => {
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
                    element.quantity = newQuantity;
                    break;
                }
            }

            if(productExists) {
                products.push({
                    productId: productId,
                    quantity: newQuantity
                });
            }

            cart.products = products;

            await cart.save();

            return res.status(200).json(cart);
        }
        catch(err) {
            return res.status(500).json(err);
        }
    },
    removeFromCart: async(req, res) => {
        try {
            const user = await User.findById(req.params.id);
            const productId = req.params.productId;
            const cart = await Cart.findById(user.cart);
            let products = cart.products;

            for(const element of products) {
                if(element.productId == productId) {
                    products.splice(products.indexOf(element), 1);
                    break;
                }
            }

            cart.products = products;

            await cart.save();

            return res.status(200).json(cart);
        }
        catch(err) {
            return res.status(500).json(err);
        }

    },

    clearCart: async(req, res) => {
        try {
            const user = await User.findById(req.params.id);
            const cart = await Cart.findById(user.cart);
            cart.products = [];
            await cart.save();
            return res.status(200).json(cart);
        }
        catch(err) {
            return res.status(500).json(err);
        }
    }
}

module.exports = CartController;