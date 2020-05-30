const mongoose = require('mongoose');

const RentalSchema = mongoose.Schema({
    furnit_id: {
        type: String,
        required: true
    },
    renter_id: {
        type: String,
        required: true
    },
    loaner_id: {
        type: String,
        required: true
    },
    loanstart: {
        type: Date,
        required: true
    },
    loanend: {
        type: Date,
        required: true
    },
    inprocess: {
        type: Boolean,
        required: true
    },
    paid: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('Rentals', RentalSchema);