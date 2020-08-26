const mongoose = require('mongoose');

const RentalSchema = mongoose.Schema({
    furnit_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    renter_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    loaner_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    loan_start: {
        type: Date,
        required: true
    },
    loan_end: {
        type: Date,
        required: true
    },
    confirmation: {
        type: Date,
        default: new Date()
    },
    status: {
        type: Number,
        required: false,
        default: 0
    },
    inprocess: {
        type: Boolean,
        required: false
    },
    paid: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    returned: {
        type: Boolean,
        default: false
    },
    review_loaner: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    review_renter: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    }
});

module.exports = mongoose.model('Rentals', RentalSchema);