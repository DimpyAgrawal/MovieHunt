const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        required: true,
    },
    movieLists: [{
        id: {
            type: String,
            required: true
        },
        public: {
            type: Boolean,
            default: false
        }
    }],
}, { timestamps: true });

module.exports = mongoose.model('userMovie', userSchema);
