const mongoose = require('mongoose');
const shopSchema = mongoose.Schema({
    name: String,
    email: String,
    accounts:{
    	mobile_number:Number,
    	country_code:Number,
    	country_id: {type: mongoose.Schema.Types.ObjectId,ref:"countries"}
    },
    credit_balance:Number,
    brands :[{
    		_id:false,
    		brand_id:{type:mongoose.Schema.Types.ObjectId, ref:"brand"},
    		discount: Number
    }],
    status :Number,
    deviceId : String
}, {
    timestamps: true
});

// var autoPopulate = function(next) {
//   this.populate(['accounts.country_id','brands.brand_id']);
//   next();
// };

// shopSchema.pre('find', autoPopulate);
module.exports = mongoose.model('shop', shopSchema);