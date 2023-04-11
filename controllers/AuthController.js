const User = require('../models/User');
const bcrypt = require('bcrypt');

const AuthController = {
    login: async (req, res) => {
        const successMessage = req.session.successMessage; // Lấy thông báo từ session
        req.session.successMessage = null; // Xóa thông báo khỏi session
        const failMessage = req.session.failMessage; // Lấy thông báo từ session
        req.session.failMessage = null; // Xóa thông báo khỏi session
        // render
        res.render('pages/login', {
            successMessage: successMessage,
            failMessage: failMessage
        });
    },
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
            req.session.successMessage = 'Đăng ký thành công!';
            res.redirect('/login');

        } catch (err) {
            req.session.failMessage = 'Đăng ký thất bại, vui lòng thử lại!';
            res.redirect('/login');
        }
    },
    //LOGIN
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                req.session.failMessage = 'Sai tài khoản hoặc mật khẩu!';
                return res.redirect('/login');
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                req.session.failMessage = 'Sai tài khoản hoặc mật khẩu!';
                return res.redirect('/login');
            }
            if (user && validPassword) {
                var sess = req.session; 
                sess.daDangNhap = true;
                sess.username = user;
                return res.redirect('/');
            }
            req.session.failMessage = 'Sai tài khoản hoặc mật khẩu!';
            return res.redirect('/login');
        } catch (err) {
            req.session.failMessage = 'Sai tài khoản hoặc mật khẩu!';
            return res.redirect('/login');
        }
    },
    myaccount: async (req, res) => {
        return res.render('pages/myaccount');
    },
    updateUser: async (req, res) => {
        try {
            var sess = req.session;
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            const id = sess.username.id;
            const newUser = req.body;
            newUser.password = hashed;
            console.log(newUser);
            const user = await User.findByIdAndUpdate(id, {
                $set: newUser
            }, {new: true});
            sess.username = user;
            res.redirect('/account');
        }
        catch(err) {
            return res.status(500).json(err);
        }
    },
    logoutUser: async (req, res) => {
        req.session.destroy();
        res.redirect('/');
    },

}

module.exports = AuthController;