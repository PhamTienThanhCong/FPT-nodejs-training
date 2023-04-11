const Category = require('../models/Category');

async function settingMiddleware(req, res, next) {
    try {
        const categories = await Category.find();
        // check login
        var sess = req.session;
        if (sess.daDangNhap) {
            res.locals.user = sess.username;
            res.locals.daDangNhap = true; 
        }else{
            res.locals.user = {
                username: 'Guest',
                id: '0'
            };
            res.locals.daDangNhap = false;
        }
        res.locals.categories = categories;
        next();
    }catch(err) {
        next();
    }
}

function authMiddleware(req, res, next) {
    var sess = req.session;
    if (!sess.daDangNhap) {
        return res.redirect('/login');
    }
    res.locals.user = sess.username;
    res.locals.daDangNhap = true; 
    res.locals.categories = categories;
    next();
}

module.exports = {
    settingMiddleware: settingMiddleware,
    authMiddleware: authMiddleware
};