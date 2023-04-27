const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const CouponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    CouponCode: {
        type: String,
        required: true,
        unique: true
    },
    Discount: {
        type: Number,
        required: true,
    },
    Validity: {
        type: Date,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    Status: {
        type: String,
        required: true,
        default: 'Active'
    },
    numberOfUsage: {
        type: Number,
        required: true,
    },
    numberOfUsageLeft: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

CouponSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Coupon', CouponSchema);