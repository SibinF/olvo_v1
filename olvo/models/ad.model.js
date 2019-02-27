const mongoose = require('mongoose');

const adSchema = mongoose.Schema({
    name: String,
    title: String,
    country_id: [{type: mongoose.Schema.Types.ObjectId,ref:"countries"}],
    image:String,
    description:String,
    brand_id: {type: mongoose.Schema.Types.ObjectId,ref:"brand"},
    status:Number,
    promo_start:String,
    promo_end:String, 
}, {
    timestamps: true
});

var autoPopulate = function(next) {
  this.populate(['country_id','brand_id']);
  next();
};

adSchema.pre('find', autoPopulate);

module.exports = mongoose.model('ad_config', adSchema);

