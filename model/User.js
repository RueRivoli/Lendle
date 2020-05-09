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
        required: true
    },
    pswd: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
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
    }
});

module.exports = mongoose.model('Users', UserSchema);