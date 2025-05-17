// backend/index.js
require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const session  = require('express-session');

const webhookRouter  = require('./routes/webhook');
const paymentRoutes  = require('./routes/payment');
const authRoutes     = require('./routes/auth');
const postRoutes     = require('./routes/posts');

const app = express();

// 1️⃣ Stripe webhook (raw body) — stays first
app.use(
  '/api/webhook',
  express.raw({ type: 'application/json' }),
  webhookRouter
);

// 2️⃣ Standard middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// 3️⃣ Now mount routes that rely on session/auth
app.use('/api/posts',   postRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/auth',    authRoutes);

// 4️⃣ Health check
app.get('/', (req, res) => res.send('Backend is working!'));

// 5️⃣ DB + server
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
