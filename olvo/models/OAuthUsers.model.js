const mongoose = require('mongoose');

const registerSchema = mongoose.Schema({
    username: String,
	password: String
}, {
    timestamps: true
});

module.exports = mongoose.model('User', registerSchema);
