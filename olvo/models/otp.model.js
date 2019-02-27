const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
    mobile_number: Number,
    code: String 
}, {
    timestamps: true
});


module.exports = mongoose.model('otp', otpSchema);

