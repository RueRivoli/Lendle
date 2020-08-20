const mongoose = require('mongoose');

const FurnitSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    city: {
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
    state: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    creation: {
        type: Date,
        default: Date.now
    },
    indisponible: {
        type: Array,
        default: []
    },
    picture_ids: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('Furnits', FurnitSchema);