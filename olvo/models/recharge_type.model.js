const mongoose = require('mongoose');

const rechargeTypeSchema = mongoose.Schema({
    name: String,
   
}, {
    timestamps: true
});


module.exports = mongoose.model('recharge_type', rechargeTypeSchema);