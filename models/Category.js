const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
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
        // maxLength: 50
    },
    image: {
        type: String,
        required: true,
        minLength: 5,
        // maxLength: 50
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
    
})

module.exports = mongoose.model('Category', categorySchema);