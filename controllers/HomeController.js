const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');


const HomeController = {
    index: async(req, res) => {
        // render
        res.render('pages/index');
    },
    category: async(req, res) => {
        // render
        // get id from url
        const id = req.params.id;
        res.render('pages/categories');
    },
    contact: async(req, res) => {
        // render
        res.render('pages/contact');
    },
    product: async(req, res) => {
        // render
        res.render('pages/product');
    },
    cart: async(req, res) => {
        // render
        res.render('pages/cart');
    },
    checkout: async(req, res) => {
        // render
        res.render('pages/checkout');
    }
    
}

module.exports = HomeController;