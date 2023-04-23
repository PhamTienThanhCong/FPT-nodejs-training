const productController = require('../../controllers/admin/ProductController');
const router = require('express').Router();
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/products/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '-' + file.originalname)
    }
  });
  
  const upload = multer({ storage: storage });

//get all products
router.get("/", productController.getAllProducts);
//create product
router.get("/add", productController.addProduct);
//create product
router.post("/create",upload.single('image'), productController.createProduct);
//get one product
router.get("/:id", productController.getProduct);
//update product
router.get("/:id/edit", productController.editProduct);
//update product
router.post("/:id/edit", upload.single('image'),productController.updateProduct);
//delete product
router.post("/:id/delete" ,productController.deleteProduct);

module.exports = router;
