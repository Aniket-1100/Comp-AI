const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });
  next();
}

// GET /api/chat/history
router.get('/history', requireAuth, async (req, res) => {
  const chats = await Chat.find({ user: req.session.userId });
  res.json({ chats });
});

// POST /api/chat/message
router.post('/message', requireAuth, async (req, res) => {
  const { role, content } = req.body;
  if (!role || !content) return res.status(400).json({ error: 'role and content required' });
  let chat = await Chat.findOne({ user: req.session.userId }).sort({ updatedAt: -1 });
  if (!chat) {
    chat = await Chat.create({ user: req.session.userId, messages: [{ role, content }] });
  } else {
    chat.messages.push({ role, content });
    await chat.save();
  }
  res.json({ chat });
});

// DELETE /api/chat/history
router.delete('/history', requireAuth, async (req, res) => {
  await Chat.deleteMany({ user: req.session.userId });
  res.json({ message: 'Chat history cleared' });
});

module.exports = router; 