const userController = require('../../controllers/admin/UserController');
const router = require('express').Router();

//get all users
router.get("/", userController.getAllUsers);

module.exports = router;
