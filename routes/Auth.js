const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/middleware').authMiddleware;

const router = require('express').Router();

router.get('/login', AuthController.login);
router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.get('/account',authMiddleware, AuthController.myaccount);
router.post('/updateUser',authMiddleware, AuthController.updateUser);
router.get('/logout',authMiddleware ,AuthController.logoutUser);

module.exports = router;