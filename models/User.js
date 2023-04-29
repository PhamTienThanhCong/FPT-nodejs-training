const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        // maxLength: 100
    },
    email: {
        type: String,
        required: true,
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
    }],
    block: {
        type: Boolean,
        default: false
    }
    
},
{timestamps: true});

userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('User', userSchema);
