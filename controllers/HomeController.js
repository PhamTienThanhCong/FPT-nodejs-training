const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const bcrypt = require('bcrypt');

const HomeController = {
    index: async (req, res) => {
        // find 8 products
        const products = await Product.find().limit(8);
        res.render('pages/index', { products });
    },
    category: async (req, res) => {
        const id = req.params.id;
        const category = await Category.findOne({ name: id }).populate('products');
        res.render('pages/categories', { category });
    },
    contact: async (req, res) => {
        // render
        res.render('pages/contact');
    },
    productList: async (req, res) => {
        const options = {
            page: req.query.page || 1, // Trang hiện tại (mặc định là 1)
            limit: 12, // Số lượng sản phẩm trên mỗi trang
        };
        const searchQuery = req.query.search || '';

        // Tạo điều kiện truy vấn dựa trên giá trị searchQuery
        const query = {
            // Tìm kiếm theo tên sản phẩm hoặc mô tả, không phân biệt chữ hoa/chữ thường
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
            ],
        };
        const products = await Product.paginate(query, options);
        res.render('pages/productList', { products, searchQuery });
    },
    product: async (req, res) => {
        const id = req.params.id;
        try {
            const product = await Product.findById(id).populate('category');
            // tìm 4 sản phẩm có cùng category
            const category = await Category.findOne({ name: product.category.name }).populate('products');
            // get 4 products from category
            category.products = category.products.slice(0, 4);
            res.render('pages/product', { product, category });
        } catch (err) {
            return res.status(500).json(err);
        }
    }

}

module.exports = HomeController;