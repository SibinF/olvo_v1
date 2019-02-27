const mongoose = require('mongoose');

const brandSchema = mongoose.Schema({
    name: String,
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'companies' },
    logo: String,
    country_enabled:[{ type: mongoose.Schema.Types.ObjectId, ref: 'countries' }],
    recharge_type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'recharge_type' }],
    supported_dialer:[{ type: mongoose.Schema.Types.ObjectId, ref: 'supported_dialers' }]
}, {
    timestamps: true
});

// var autoPopulate = function(next) {
//   this.populate(['recharge_type','country_enabled','company_id','supported_dialer',{path:'company_id',populate:{path: 'address.country_id'}}]);
//   next();
// };

// brandSchema.pre('find', autoPopulate);


module.exports = mongoose.model('brand', brandSchema); 