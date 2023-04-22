const Category = require('../../models/Category');
const Product = require('../../models/Product');

const CategoryController = {
    getAllCategories: async(req, res) => {
        try {
            // lấy search từ query
            const search = req.query.search;
            if (!search) {
                // nếu không có search thì trả về tất cả category
                const categories = await Category.find().populate('products');
                return res.render('admin/category', {categories, search: ''});
            }
            // tìm kiếm theo tên
            const categories = await Category.find({name: {$regex: search, $options: 'i'}}).populate('products');
            return res.render('admin/category', {categories, search});
        }catch(err) {
            return res.send("error network");
        }
    },
    getCategory: async(req, res) => {
        try {
            const category = await Category.findById(req.params.id).populate('products');
            return res.status(200).json(category);
        }catch(err) {
            return res.send("error network");
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
            return res.send("error network");
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
            return res.send("error network");
        }
    },
    updateCategory: async(req, res) => {
        try {
            const category = await Category.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {new: true});
            return res.status(200).json(category);
        }catch(err) {
            
            return res.send("error network");
        }
    }
}

module.exports = CategoryController;