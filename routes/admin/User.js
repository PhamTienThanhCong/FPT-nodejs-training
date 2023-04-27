const userController = require('../../controllers/admin/UserController');
const router = require('express').Router();

//get all users
router.get("/", userController.getAllUsers);

//view user by id
router.get("/:id/edit", userController.viewUser);
// update user by id
router.post("/:id/update", userController.updateUser);
// block user by id
router.get("/:id/block", userController.blockUser);
// unblock user by id
router.get("/:id/unblock", userController.unblockUser);

module.exports = router;
