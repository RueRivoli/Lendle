const mongoose = require('mongoose');

const DialogSchema = mongoose.Schema({
    loaner_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    renter_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    furnit_id: {
        type: Array,
        required: false,
        default: []
    },
    last_talk: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Dialogs', UserSchema);