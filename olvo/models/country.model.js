const mongoose = require('mongoose');

const countrySchema = mongoose.Schema({
    name: String,
    iso:String,
    currency:String,
    rate:Number,
   	currency_iso:String,
   	zero_decimal:Boolean
});

module.exports = mongoose.model('countries', countrySchema);
