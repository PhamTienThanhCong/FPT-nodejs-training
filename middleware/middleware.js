const Category = require('../models/Category');

async function settingMiddleware(req, res, next) {
    try {
        const categories = await Category.find();
        // check login
        var sess = req.session;
        if (sess.isLogined) {
            res.locals.user = sess.username;
            res.locals.isLogined = true; 
        }else{
            res.locals.user = {
                username: 'Guest',
                id: '0'
            };
            res.locals.isLogined = false;
        }
        res.locals.categories = categories;
        next();
    }catch(err) {
        next();
    }
}

async function authMiddleware(req, res, next) {
    var sess = req.session;
    const categories = await Category.find();
    if (!sess.isLogined) {
        return res.redirect('/login');
    }
    res.locals.user = sess.username;
    res.locals.isLogined = true; 
    res.locals.categories = categories;
    next();
}

module.exports = {
    settingMiddleware: settingMiddleware,
    authMiddleware: authMiddleware
};