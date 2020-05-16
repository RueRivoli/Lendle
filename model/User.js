const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: false
    },
    lastname: {
        type: String,
        required: false
    },
    mail: {
        type: String,
        required: false
    },
    pswd: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    usurer: {
        type: Boolean,
        default: true
    },
    borrower: {
        type: Boolean,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    subscription: {
        type: Date,
        default: Date.now
    },
    language: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model('Users', UserSchema);