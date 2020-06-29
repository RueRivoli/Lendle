const mongoose = require('mongoose');

const TokenSchema = mongoose.Schema({
    _userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, ref: 'User' 
    },
    token: {
        type: String,
        required: true
    },
    tokenExpires: {
        type: Date,
        required: true,
        default: Date.now() + 3600000
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }
});

module.exports = mongoose.model('Tokens', TokenSchema);