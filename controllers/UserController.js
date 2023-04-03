const User = require('../models/User');

const UserController = {
    getAllUsers: async(req, res) => {
        try {
            const users = await User.find();
            return res.status(200).json(users);
        }catch(err) {
            return res.status(500).json(err);
        }
    },
    deleteUser: async(req, res) => {
       //delete user
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            return res.status(200).json(user.username + ' deleted');
        }
        catch(err) {
            return res.status(500).json(err);
        }
    },
    updateUser: async(req, res) => {
        //update user
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {new: true});
            return res.status(200).json(user);
        }
        catch(err) {
            return res.status(500).json(err);
        }
    },
    getUser: async(req, res) => {
        //get user
        try {
            const user = await User.findById(req.params.id);
            return res.status(200).json(user);
        }
        catch(err) {
            return res.status(500).json(err);
        }
    }
}

module.exports = UserController;