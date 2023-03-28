const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
        // maxLength: 100
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    admin: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: 'Việt Nam'
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]
    
},
{timestamps: true});


module.exports = mongoose.model('User', userSchema);
