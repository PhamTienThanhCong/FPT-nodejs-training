const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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
    coupon: {
        type: Object,
        default: null
    },
    status: {
        type: String,
        default: 'Pending'
    },
    paymentType: {
        type: String,
    }
    
},
{timestamps: true});
OrderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Order', OrderSchema);