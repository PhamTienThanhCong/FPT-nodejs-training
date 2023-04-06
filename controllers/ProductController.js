const Product = require('../models/Product');
const Category = require('../models/Category');


const ProductController = {
    //get all
    getAllProducts: async (req, res) => {
        try {
            let products = [];
            if (req.query.category) {
                const categoryName = req.query.category;
                const category = await Category.findOne({ name: categoryName });
                products = await Object.assign(Product.find({ 'category': category._id }));
                console.log('abc')
            }
            else if (req.query.search) {
                const search = req.query.search;
                products = await Object.assign(Product.find({ 'name': new RegExp(search, 'i') }));
                console.log(products)
            }
            else {
                products = await Object.assign(Product.find());
                console.log('aaaa')
            }
            console.log(products);
            // add header access control expose headers
            res.header("Access-Control-Expose-Headers", "Content-Range");

            res.header("Content-Range", `products 0-9/${products.length}`);

            return res.status(200).json(products);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    getProduct: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id).populate('category');

            return res.status(200).json(product);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    deleteProduct: async (req, res) => {
        try {

            await Category.updateMany(
                { products: req.params.id },
                { $pull: { products: req.params.id } }
            );
            await Product.findByIdAndDelete(req.params.id);
            return res.status(200).json('Product deleted');

        } catch (err) {
            return res.status(500).json(err);
        }
    },
    createProduct: async (req, res) => {
        try {
            const newProduct = new Product(req.body);
            const product = await newProduct.save();
            await Category.findByIdAndUpdate(req.body.category, {
                $push: { products: product._id }
            });

            return res.status(200).json(product);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    updateProduct: async (req, res) => {
        try {
            const product = await Product.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true });

            return res.status(200).json(product);
        } catch (err) {
            return res.status(500).json(err);
        }
    }
}

module.exports = ProductController;