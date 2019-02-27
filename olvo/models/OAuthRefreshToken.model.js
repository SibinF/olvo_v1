const mongoose = require('mongoose');

const OAuthRefreshTokenSchema = mongoose.Schema({
  refreshToken: String,
  refreshTokenExpiresAt: Date,
  scope: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'OAuthClient' },
});

module.exports = mongoose.model('OAuthRefreshToken', OAuthRefreshTokenSchema);
 

