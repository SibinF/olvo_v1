const mongoose = require('mongoose');

const OAuthAccessTokenSchema = mongoose.Schema({
  accessToken: String,
  accessTokenExpiresAt: Date,
  scope: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'OAuthClient' }
});

module.exports = mongoose.model('OAuthAccessToken', OAuthAccessTokenSchema);

