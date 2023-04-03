const categoryController = require('../controllers/CategoryController');
const router = require('express').Router();

//get all categories
router.get("/", categoryController.getAllCategories);
//get one category
router.get("/:id", categoryController.getCategory);
//delete category
router.delete("/:id", categoryController.deleteCategory);
//create category
router.post("/", categoryController.createCategory);
//update category
router.put("/:id", categoryController.updateCategory);

module.exports = router;
