// backend/index.js
require('dotenv').config();

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const session  = require('express-session');

const webhookRouter  = require('./routes/webhook');
const paymentRoutes  = require('./routes/payment');
const authRoutes     = require('./routes/auth');
const postRouter     = require('./routes/posts');
const eventRoutes    = require('./routes/event');
// (ensureAdmin is used inside events.js, so we don’t need to re‐import it here)

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
    origin: process.env.FRONTEND_URL, // e.g. "http://localhost:5173"
    credentials: true,                // ← must be “true” so the browser will send cookies
  })
);

// 2b) Body parsers for JSON / URL‐encoded payloads (for all other routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2c) Session setup: store sessions in memory (for dev); make sure “sameSite” and “secure” allow cross‐origin cookies
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,     // ← in local dev, keep this false; if you later serve over HTTPS, set to true
      httpOnly: true,    // ← good practice: client JS cannot read the cookie
      sameSite: 'lax',   // ← ‘lax’ is often enough for cross‐origin localhost setups
      // (if you set sameSite: 'none', you MUST set secure: true in production)
    },
  })
);

// ── 3️⃣ Protected routes that rely on session/auth ―――――――――――――――――――――――――――――――
// Mount your “logged‐in only” routers here. Because CORS + session are both “live” above,
// express-session will read/write the session cookie when these routes are invoked.

app.use('/api/posts',   postRouter);
app.use('/api/payment', paymentRoutes);
app.use('/api/auth',    authRoutes);
app.use('/api/events',  eventRoutes);

// ── Health check ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
app.get('/', (req, res) => res.send('Backend is working!'));

// ── 4️⃣ Connect to MongoDB & start server ―――――――――――――――――――――――――――――――――――――――――――
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
