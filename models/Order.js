const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        type: Object,
        required: true}
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'Pending'
    },
    paymentType: {
        type: String,
        default : 'Paypal'
    }
    
},
{timestamps: true});

module.exports = mongoose.model('GioHang', OrderSchema);