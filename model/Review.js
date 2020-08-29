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
    text: {
        type: String,
        required: false,
        default: ''
    },
    mark: {
        type: Double,
        required: true
    },
    /* If rental is finished before loan_end */
    reason: {
        type: String,
        required: false,
        default: ''
    }, 
});

module.exports = mongoose.model('Reviews', ReviewSchema);