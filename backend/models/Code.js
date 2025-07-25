const mongoose = require('mongoose');

const CodeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  code: { type: String, required: true },
  css: { type: String },
  title: { type: String },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Code', CodeSchema); 