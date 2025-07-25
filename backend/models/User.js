const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Only for email/password users
  oauthProvider: { type: String }, // e.g., 'google', 'github'
  oauthId: { type: String }, // Provider user ID
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema); 