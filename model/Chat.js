const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    author_id: {
        type: String,
        required: false
    },
    mail: {
        type: String,
        required: false
    },
    text: {
        type: String,
        required: false
    },
    time: {
        type: Date,
        required: false
    },
});

module.exports = mongoose.model('Chats', UserSchema);