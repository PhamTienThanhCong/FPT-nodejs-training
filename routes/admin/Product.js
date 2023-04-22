const productController = require('../../controllers/admin/ProductController');
const router = require('express').Router();


//get all products
router.get("/", productController.getAllProducts);
//create product
router.get("/add", productController.addProduct);
//create product
router.post("/create", productController.createProduct);
//get one product
router.get("/:id", productController.getProduct);
//update product
router.get("/:id/edit", productController.editProduct);
//update product
router.post("/:id/edit", productController.updateProduct);
//delete product
router.post("/:id/delete" ,productController.deleteProduct);

module.exports = router;
