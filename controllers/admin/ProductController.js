const Product = require('../../models/Product');
const Category = require('../../models/Category');
const Order = require('../../models/Order');


const formatDate = (date) => {
    let newDate = new Date(date);
    let formattedDate = newDate.toLocaleDateString();
    let formattedTime = newDate.toLocaleTimeString();
    return formattedDate + " " + formattedTime;
}

const ProductController = {
    //get all
    getAllProducts: async (req, res) => {

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
        return res.render('admin/products', { products, searchQuery });
    },
    getProduct: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id).populate('category');
            // format date
            let createdAt = formatDate(product.createdAt);
            let updatedAt = formatDate(product.updatedAt);
            // Tìm tất cả order 
            const orders = await Order.find().sort({ createdAt: -1 });
            // đếm số lượng sản phẩm đã bán
            let totalSales = 0;
            let totalRefund = 0;
            orders.forEach(order => {
                order.products.forEach(productOrder => {
                    if (productOrder.productId == req.params.id) {
                        totalSales += productOrder.quantity;
                    }
                    if (productOrder.productId == req.params.id && productOrder.status == 'refund') {
                        totalRefund += productOrder.quantity;
                    }
                })
            })
            return res.render('admin/product-detail', { product, totalSales, totalRefund, createdAt, updatedAt });
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
            return res.redirect('/admin/product');
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    addProduct: async (req, res) => {
        try {
            const categories = await Category.find();
            return res.render('admin/product-add', { categories });
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    createProduct: async (req, res) => {
        try {
            const newProduct = new Product({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                category: req.body.category,
                quantity: req.body.quantity,
            });

            // Handle image file upload
            const imageFile = req.file.filename;

            newProduct.image = `/uploads/products/${imageFile}`;
            const product = await newProduct.save();
            await Category.findByIdAndUpdate(req.body.category, {
                $push: { products: product._id }
            });
            return res.redirect(`/admin/product/${product._id}`);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    editProduct: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id).populate('category');
            const categories = await Category.find();

            return res.render('admin/product-edit', { product, categories });
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    updateProduct: async (req, res) => {
        try {
            const product = await Product.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true });
            // Handle image file upload
            const imageFile = req.file.filename;

            if (imageFile) {
                product.image = `/uploads/products/${imageFile}`;
            }
            await product.save();

            return res.redirect(`/admin/product/${product._id}`);
        } catch (err) {
            return res.redirect(`/admin/product/${product._id}/edit`);
        }
    }
}

module.exports = ProductController;