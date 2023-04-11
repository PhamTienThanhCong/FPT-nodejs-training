const bcrypt = require('bcrypt');
const User = require('../../models/User');
const Cart = require('../../models/Cart');
const dotenv = require('dotenv');

dotenv.config();

var data
const authController = {
    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            
            //create new user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                password: hashed,
                
            });
            //save new user to database
            const user = await newUser.save();
            const cart = await new Cart({
                userId: user.id,
                products: []
            });

            user.cart = cart.id;
            await user.save();
            await cart.save();
            
            await cart.save();
            return res.status(200).json(user);
        } catch (err) {
            console.log(data)
            return res.status(500).json(err);
        }
    },
    //LOGIN
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Wrong password' });
            }
            if (user && validPassword) {
                var sess = req.session; 
                sess.daDangNhap = true;
                sess.username = user;
                return res.status(200).json({ message: 'Logged in', user: user });
            }
            return res.status(500).json("sai tai khoan hoac mat khau");
        } catch (err) {
            return res.status(500).json("sai tai khoan hoac mat khau");
        }
    },
    // check login
    checkLogin: async (req, res) => {
        try {
            var sess = req.session;
            if (sess.daDangNhap) {
                return res.status(200).json({ message: 'Logged in', user: sess.username });
            }
            return res.status(500).json("chua dang nhap");
        } catch (err) {
            return res.status(500).json("chua dang nhap");
        }
    },
    //logout
    logoutUser: async (req, res) => {
        req.session.destroy();
        return res.status(200).json({ message: 'Logged out' });
    }
}

module.exports = authController;
    