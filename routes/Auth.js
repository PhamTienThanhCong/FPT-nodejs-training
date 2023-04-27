const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/middleware').authMiddleware;

const router = require('express').Router();

router.get('/login', AuthController.login);
router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.get('/account', AuthController.myaccount);
router.post('/updateUser', AuthController.updateUser);
router.get('/logout' ,AuthController.logoutUser);

module.exports = router;