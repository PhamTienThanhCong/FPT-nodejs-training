const authController = require('../../controllers/apis/AuthController');
const router = require('express').Router();

//register
router.post('/register', authController.registerUser);

//login
router.post('/login', authController.loginUser);

//logout
router.get('/logout', authController.logoutUser);

// check login
router.get('/checkLogin', authController.checkLogin);


module.exports = router;