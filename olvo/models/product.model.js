const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: String,
    title: String,
    description: String,
    offer_message: String,
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'brand' },
    image: String,
    profit_margin: Number,
    buy_rate: Number,
    varient:[{
    	country_id: { type: mongoose.Schema.Types.ObjectId,ref: 'countries' },
    	display_name : String,
    	sell_rate : Number,
    	sell_rate_local : Number,
    	max_retail_price : Number,
    	profit_margin : Number
    }],
    recharge_type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'recharge_type' }],
}, {
    timestamps: true
});

// var autoPopulate = function(next) {
//   this.populate(['recharge_type','brand_id','varient.country_id']);
//   next();
// };

// productSchema.pre('find', autoPopulate);


module.exports = mongoose.model('product', productSchema);