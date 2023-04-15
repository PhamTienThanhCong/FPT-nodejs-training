const Product = require('../models/Product');
const Category = require('../models/Category');

const HomeController = {
    index: async (req, res) => {
        // find 8 products
        const products = await Product.find().limit(8);
        res.render('pages/index', { products });
    },
    category: async (req, res) => {
        const name = req.params.id;
        const category = await Category.findOne({ name: name }).populate('products');
        res.render('pages/categories', { category });
    },
    contact: async (req, res) => {
        // render
        res.render('pages/contact');
    },
    productList: async (req, res) => {
        const options = {
            page: req.query.page || 1, 
            limit: 12, 
        };
        const searchQuery = req.query.search || '';

        const query = {
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