const mongoose = require('mongoose');

// transaction type: 0-Debit, 1-Credit
// status sucess-1, failed -0
const transactionSchema = mongoose.Schema({
    transaction_number: String,
    transaction_type: Number,
    shop_id: { type: mongoose.Schema.Types.ObjectId, ref: 'shop' },
    updated_balance: Number,
    amount: Number,
    status : Number,
    recharge_type:{ type: mongoose.Schema.Types.ObjectId, ref: 'recharge_type' }
}, {
    timestamps: true
});


module.exports = mongoose.model('transaction', transactionSchema); 

