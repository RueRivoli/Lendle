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
    username: {
        type: String,
        required: false
    },
    mail: {
        type: String,
        required: false
    },
    profilePicture: {
        type: String,
        required: false
    },
    facebookId: {
        type: String,
        required: false
    },
    googleId: {
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
    postcode: {
        type: Number,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    // token: {
    //     type: String,
    //     required: false
    // },
    // tokenExpires: {
    //     type: Date,
    //     required: false
    // },
    isVerified: {
        type: Boolean,
        default: false
    },
    loaner: {
        type: Boolean,
        default: false
    },
    renter: {
        type: Boolean,
        default: false
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
    mark: {
        type: Number,
        required: false
    },
});

module.exports = mongoose.model('Users', UserSchema);