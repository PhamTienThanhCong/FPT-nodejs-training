const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userProfile: {
        type: Object,
        required: true,
        default: {
            name: '',
            email: '',
            phone: '',
            address: '',
            note: ''
        }
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
        default : 'Cash on delivery'
    }
    
},
{timestamps: true});

module.exports = mongoose.model('giohang', OrderSchema);