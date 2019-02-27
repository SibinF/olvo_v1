const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
    name: String,
    address: {
    			street:String,
    			location:String,
    			country_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'countries' }
    		},
    contact:[{
    			name:String,
    			email:String,
    			department:String,
    			mobile:[Number]
    		}]
}, {
    timestamps: true
});

module.exports = mongoose.model('companies', companySchema); 

