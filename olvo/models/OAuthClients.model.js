const mongoose = require('mongoose');

const OAuthClientSchema = mongoose.Schema({
  name: String,
  clientId: String,
  clientSecret: String,
  redirectUris: {
    type: [String]
  },
  grants: {
    type: [String],
    default: ['authorization_code', 'password', 'refresh_token', 'client_credentials']
  },
  scope: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('OAuthClient', OAuthClientSchema);
