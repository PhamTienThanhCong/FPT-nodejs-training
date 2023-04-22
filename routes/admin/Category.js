const categoryController = require('../../controllers/admin/CategoryController');
const router = require('express').Router();
const path = require('path');
const multer = require('multer');

// Khởi tạo disk storage engine để lưu trữ file được upload vào thư mục uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/categories/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '-' + file.originalname)
    }
  });
  
  // Khởi tạo middleware upload với disk storage engine vừa được khởi tạo
  const upload = multer({ storage: storage });

//get all categories
router.get("/", categoryController.getAllCategories);
//create category
router.get("/add", categoryController.addCategory);
//create category
router.post("/create",upload.single('image'), categoryController.createCategory);
//get one category
router.get("/:id", categoryController.getCategory);
router.get("/:id/edit", categoryController.editCategory);
router.post("/:id/edit", upload.single('image'), categoryController.updateCategory);
//delete category
router.post("/:id/delete", categoryController.deleteCategory);
//update category

module.exports = router;
