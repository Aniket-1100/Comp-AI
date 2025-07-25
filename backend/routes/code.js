const express = require('express');
const router = express.Router();
const Code = require('../models/Code');

function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });
  next();
}

// GET /api/code/history
router.get('/history', requireAuth, async (req, res) => {
  const codes = await Code.find({ user: req.session.userId });
  res.json({ codes });
});

// POST /api/code/save
router.post('/save', requireAuth, async (req, res) => {
  const { code, css, title, description } = req.body;
  if (!code) return res.status(400).json({ error: 'code required' });
  const doc = await Code.create({ user: req.session.userId, code, css, title, description });
  res.json({ code: doc });
});

module.exports = router; 