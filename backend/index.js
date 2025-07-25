require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('redis');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend URL
app.use(cors({
  origin: 'http://localhost:8081', // update to deployed frontend URL when ready
  credentials: true
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Redis Setup
const redisClient = createClient({
  legacyMode: true,
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.connect().catch(err => {
  console.warn('⚠️ Redis not available, falling back to in-memory session store.');
});

(async () => {
  let sessionOptions = {
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    }
  };

  // Try using Redis for session storage
  try {
    const { default: RedisStore } = await import('connect-redis');
    sessionOptions.store = new RedisStore({ client: redisClient });
    console.log('✅ Using Redis for session store.');
  } catch (err) {
    console.warn('⚠️ Could not use Redis session store:', err.message);
  }

  // Session Middleware
  app.use(session(sessionOptions));

  // API Routes
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/chat', require('./routes/chat'));
  app.use('/api/code', require('./routes/code'));

  // Cohere API Integration
  app.post('/api/cohere/generate', async (req, res) => {
    try {
      const { prompt, jsx } = req.body;

      const fullPrompt = jsx
        ? `Given the following React component code:\n\n${jsx}\n\nApply this instruction: ${prompt}\n\nReturn ONLY the updated JSX code block needed to make the change.`
        : prompt;

      const response = await axios.post('https://api.cohere.ai/v1/generate', {
        model: 'command',
        prompt: fullPrompt,
        max_tokens: 300,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      res.json(response.data);
    } catch (err) {
      res.status(500).json({ error: 'Cohere API error', details: err.message });
    }
  });

  // Serve frontend (React build)
  app.use(express.static(path.join(__dirname, 'public')));

  // Handle SPA routes (non-API)
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  // Start server
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})();
