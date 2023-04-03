const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');


const HomeController = {
    index: async(req, res) => {
        // render
        res.render('index');
    }
}

module.exports = HomeController;