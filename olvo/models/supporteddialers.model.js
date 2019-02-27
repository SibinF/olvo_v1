const mongoose = require('mongoose');

const supportedialerSchema = mongoose.Schema({
    name: String,
    logo: String
});

module.exports = mongoose.model('supported_dialers', supportedialerSchema); 
