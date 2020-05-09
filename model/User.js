const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    pswd: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    usurer: {
        type: Boolean,
        required: true
    },
    borrower: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    subscription: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Users', UserSchema);