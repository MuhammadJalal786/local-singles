// backend/index.js
require('dotenv').config();

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const session  = require('express-session');

// Import routers/controllers
const webhookRouter  = require('./routes/webhook');
const paymentRoutes  = require('./routes/payment');
const authRoutes     = require('./routes/auth');
const postRouter     = require('./routes/posts');
const eventRoutes    = require('./routes/event');
const userRoutes     = require('./routes/user');
const supportRoutes = require('./routes/support');
const messagesRouter = require('./routes/messages');
const usersRouter = require('./routes/users');
const adminSettingsRouter = require('./routes/admin/settings');
const adminUsersRouter    = require('./routes/admin/users');
const adminMessagesRouter = require('./routes/admin/messages');
const adminEventsRouter = require('./routes/admin/events');
const notificationsRouter = require('./routes/notifications');
// ── Create Express app ─────────────────────────────────────────────────────────────
const app = express();

// ── 1️⃣ Stripe webhook (must come before express.json()) ────────────────────────────
// ‣ The raw body parser is required for Stripe’s signature check
app.use(
  '/api/webhook',
  express.raw({ type: 'application/json' }),
  webhookRouter
);

// ── 2️⃣ CORS + body parsers + session ―――――――――――――――――――――――――――――――――――――――――――――
// 2a) CORS: allow your React origin, and permit credentials (cookies) to be sent
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// 2b) Body parsers for JSON / URL‐encoded payloads (for all other routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2c) Session setup: store sessions in memory (for dev);
//     make sure “sameSite” and “secure” allow cross‐origin cookies
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,     // in development, keep this false; in production over HTTPS, set to true
      httpOnly: true,    // prevents client‐side JS from reading the cookie
      sameSite: 'lax',   // ‘lax’ works for cross‐origin localhost; if you use ‘none’, must set secure: true
    },
  })
);

// ── 3️⃣ Mount user routes (needs to come AFTER session middleware) ───────────────────
app.use('/api/user', userRoutes);

app.use('/api/admin/settings', adminSettingsRouter);

// ── 4️⃣ Other protected/public routes ―――――――――――――――――――――――――――――――――――――――――――――
app.use('/api/posts',   postRouter);
app.use('/api/payment', paymentRoutes);
app.use('/api/auth',    authRoutes);
app.use('/api/events',  eventRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/messages', messagesRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin/users',    adminUsersRouter);
app.use('/api/admin/messages', adminMessagesRouter);
app.use('/api/admin/events', adminEventsRouter);
app.use('/api/notifications', notificationsRouter);

// ── Health check ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
app.get('/', (req, res) => res.send('Backend is working!'));

// ── 5️⃣ Connect to MongoDB & start server ―――――――――――――――――――――――――――――――――――――――――
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
