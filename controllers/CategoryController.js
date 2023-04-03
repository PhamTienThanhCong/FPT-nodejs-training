const Category = require('../models/Category');
const Product = require('../models/Product');

const CategoryController = {
    getAllCategories: async(req, res) => {
        try {
            const categories = await Category.find();
            res.header("Access-Control-Expose-Headers", "Content-Range");
           
            res.header("Content-Range", `products 0-9/${categories.length}`);
            return res.status(200).json(categories);
        }catch(err) {
            return res.status(500).json(err);
        }
    },
    getCategory: async(req, res) => {
        try {
            const category = await Category.findById(req.params.id).populate('products');
            return res.status(200).json(category);
        }catch(err) {
            return res.status(500).json(err);
        }
    },

    deleteCategory: async(req, res) => {
        try {
            await Product.updateMany(
                {category: req.params.id},
                {$pull: {category: req.params.id}}
            );
            await Category.findByIdAndDelete(req.params.id);
            return res.status(200).json('Category deleted');
        }catch(err) {
            return res.status(500).json(err);
        }
    },
    createCategory: async(req, res) => {
        try {
            const newCategory = await new Category({
                name: req.body.name,
                description: req.body.description,
                image: req.body.image,
            })
            const category = await newCategory.save();
            return res.status(200).json(category);
        }catch(err) {
            return res.status(500).json(err);
        }
    },
    updateCategory: async(req, res) => {
        try {
            const category = await Category.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {new: true});
            return res.status(200).json(category);
        }catch(err) {
            
            return res.status(500).json(err);
        }
    }
}

module.exports = CategoryController;