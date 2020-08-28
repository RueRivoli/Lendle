const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    rental_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    review: {
        type: String,
        required: false,
        default: ''
    },
    mark: {
        type: Double,
        required: true
    }
});

module.exports = mongoose.model('Reviews', ReviewSchema);