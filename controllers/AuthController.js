const User = require('../models/User');
const Cart = require("../models/Cart")
const bcrypt = require('bcrypt');

const AuthController = {
    login: async (req, res) => {
        const successMessage = req.session.successMessage; 
        req.session.successMessage = null;
        const failMessage = req.session.failMessage; 
        req.session.failMessage = null;
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
            req.session.successMessage = 'resgister success!, please login to continue';
            res.redirect('/login');

        } catch (err) {
            req.session.failMessage = 'resgister fail!, please try again';
            res.redirect('/login');
        }
    },
    //LOGIN
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                req.session.failMessage = 'username or password is incorrect!';
                return res.redirect('/login');
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                req.session.failMessage = 'username or password is incorrect!';
                return res.redirect('/login');
            }
            if (user && validPassword) {
                var sess = req.session; 
                sess.isLogined = true;
                sess.username = user;
                if (user.admin == true) {
                    return res.redirect('/admin');
                }
                return res.redirect('/');
            }
            req.session.failMessage = 'username or password is incorrect!';
            return res.redirect('/login');
        } catch (err) {
            req.session.failMessage = 'username or password is incorrect!';
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