const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
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
        type: Number,
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