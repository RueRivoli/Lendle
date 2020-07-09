const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    dest_id: {
        type: mongoose.Schema.Types.ObjectId,
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
        default: Date.now
    },
});

module.exports = mongoose.model('Chats', UserSchema);