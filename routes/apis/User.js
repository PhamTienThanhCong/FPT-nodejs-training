const userController = require('../../controllers/apis/UserController');
const router = require('express').Router();

//get all users
router.get("/", userController.getAllUsers);

// get users
router.get("/:id", userController.getUser);

//delete user
router.delete("/:id" ,userController.deleteUser);
//update user
router.put("/:id" ,userController.updateUser);

module.exports = router;
