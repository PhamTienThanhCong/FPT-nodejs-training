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
            return res.render('admin/category-detail', {category});

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
            return res.redirect('/admin/category');
        }catch(err) {
            return res.send("error network");
        }
    },
    addCategory: async(req, res) => {
        try {
            return res.render('admin/category-add');
        }catch(err) {
            return res.send("error network");
        }
    },
    createCategory: async(req, res) => {
        try {
            const newCategory = await new Category({
                name: req.body.name,
                description: req.body.description,
            })
            const imageFile = req.file.filename;

            newCategory.image = `/uploads/categories/${imageFile}`;

            const category = await newCategory.save();
            return res.redirect(`/admin/category/${category._id}`);
        }catch(err) {
            return res.send(err);
        }
    },
    editCategory: async(req, res) => {
        try {
            const category = await Category.findById(req.params.id);

            return res.render('admin/category-edit', {category});
        }catch(err) {
            return res.send("error network");
        }
    },
    updateCategory: async(req, res) => {
        try {
            const category = await Category.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {new: true});
            const imageFile = req.file.filename;

            if (imageFile) {
                category.image = `/uploads/categories/${imageFile}`;
                await category.save();
            }
            return res.redirect(`/admin/category/${category._id}`);
        }catch(err) {
            
            return res.send("error network");
        }
    }
}

module.exports = CategoryController;