require('dotenv').config();
const express = require('express');
const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Route'lar ────────────────────────────────────────────────────────────────
app.use('/auth',  require('./routes/auth.routes'));
app.use('/posts', require('./routes/post.routes'));
app.use('/users', require('./routes/user.routes'));
app.use('/admin', require('./routes/admin.routes'));

// ─── Sağlık kontrolü ─────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Global hata yakalayıcı (en sona) ────────────────────────────────────────
app.use(require('./middlewares/errorHandler'));

module.exports = app;
