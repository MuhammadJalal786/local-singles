// backend/routes/payment.js
const express = require('express');
const router  = express.Router();
const stripe  = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User    = require('../models/User');

// POST /api/payment/create-checkout-session
router.post('/create-checkout-session', async (req, res) => {
  try {
    // 1) Ensure user is authenticated
    const userId = req.session?.user?._id;
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    // 2) Load user & create Stripe Customer if needed
    const user = await User.findById(userId);
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name:  `${user.firstName} ${user.lastName}`
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    // 3) Build your URLs
    const FRONTEND_URL = process.env.FRONTEND_URL || process.env.DOMAIN;
    if (!FRONTEND_URL) {
      console.error('Missing FRONTEND_URL / DOMAIN env var');
      return res.status(500).json({ message: 'Server mis-configured' });
    }

    // 4) Create the Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: user.stripeCustomerId,
      line_items: [
        { price: process.env.STRIPE_PRICE_ID, quantity: 1 }
      ],
      success_url: `${FRONTEND_URL}/?session_id={CHECKOUT_SESSION_ID}`,  // landing at “/”
      cancel_url:  `${FRONTEND_URL}/login`                              // back to login
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error('Error creating Checkout Session:', err);
    return res.status(500).json({ message: 'Could not start checkout' });
  }
});

// POST /api/payment/trial
router.post('/trial', async (req, res) => {
  try {
    const userId = req.session?.user?._id;
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    const user = await User.findById(userId);
    user.subscriptionStatus = 'trialing';
    user.trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await user.save();

    return res.json({ message: 'Trial started', redirect: '/' });
  } catch (err) {
    console.error('Trial error:', err);
    return res.status(500).json({ message: 'Could not start trial' });
  }
});

module.exports = router;
