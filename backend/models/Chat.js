
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'ai'], required: true },
  content: { type: String, required: true },
}, { _id: false });

const ChatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [MessageSchema],
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema); 