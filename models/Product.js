const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20,
        unique: true
    },
    description: {
        type: String,
        required: true,
        minLength: 5,
        // maxLength: 100,
    },
    image: {
        type: String,
        required: true,
        minLength: 5,
        // maxLength: 50
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
},

{timestamps: true});


module.exports = mongoose.model('Product', productSchema);
