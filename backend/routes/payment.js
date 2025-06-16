// backend/routes/payment.js
const express = require('express');
const router  = express.Router();
const stripe  = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User    = require('../models/User');

// Simple auth middleware
const ensureAuth = (req, res, next) => {
  if (req.session?.user?._id) {
    req.userId = req.session.user._id;
    return next();
  }
  return res.status(401).json({ message: 'Not authenticated' });
};

/**
 * GET /api/payment/subscription
 * Return Stripe subscription details for the logged‐in user.
 */
router.get('/subscription', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // trial logic omitted for brevity…

    // 1) Fetch from Stripe
    const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

    
    // 2) Read the item-level timestamps (in seconds)
    const secondsEnd =
      subscription.items.data[0].current_period_end  ||  // billing-period end :contentReference[oaicite:5]{index=5}
      subscription.items.data[0].cancel_at          ||  // scheduled cancel, if any 
      0;

    // 3) Convert to ms for JS Date
    const periodEndMs = secondsEnd * 1000; 

    // 4) Friendly plan name
    const item     = subscription.items.data[0];
    const planName = 'Member Plan';

    // 5) Status override from your DB flag
    const status =
      user.subscriptionStatus === 'cancelled'
        ? 'cancelled'
        : subscription.status;

    // 6) Return the properly‐typed JSON
    return res.json({
      plan:             planName,
      price:            (item.price?.unit_amount || 0) / 100,
      currency:         subscription.currency,
      status,
      currentPeriodEnd: periodEndMs,       // now a real ms timestamp :contentReference[oaicite:4]{index=4}
      dailyPostUsage:   { used: 3, limit: 10 }
    });
  } catch (err) {
    console.error('getSubscription error:', err);
    return res.status(500).json({ message: 'Could not fetch subscription.' });
  }
});


/**
 * POST /api/payment/create-checkout-session
 * Create a Stripe Checkout Session for upgrading or subscribing.
 */
router.post('/create-checkout-session', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Ensure Stripe Customer exists
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name:  `${user.firstName} ${user.lastName}`
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: user.stripeCustomerId,
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${FRONTEND_URL}/settings/pricing`
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('create-checkout-session error:', err);
    res.status(500).json({ message: 'Could not start checkout.' });
  }
});

/**
 * POST /api/payment/cancel-subscription
 * Cancel the user’s Stripe subscription immediately.
 */
router.post('/cancel-subscription', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user?.stripeSubscriptionId) {
      return res.status(404).json({ message: 'No subscription to cancel.' });
    }

    // Schedule cancel at end of period (so current_period_end stays valid)
    const updated = await stripe.subscriptions.update(
      user.stripeSubscriptionId,
      { cancel_at_period_end: true }
    );

    // Flag in your own DB
    user.subscriptionStatus = 'cancelled';
    await user.save();

    return res.json({
      message: 'Subscription will cancel at period end.',
      status: updated.status,               // still "active" until period end
      cancelAt: updated.cancel_at * 1000    // ms since epoch
    });
  } catch (err) {
    console.error('cancel-subscription error:', err);
    return res.status(500).json({ message: 'Could not cancel subscription.' });
  }
});

/**
 * POST /api/payment/update-subscription
 * Change the user’s existing subscription to a new Price ID.
 * Body: { newPriceId: string }
 */
router.post('/update-subscription', ensureAuth, async (req, res) => {
  try {
    const { newPriceId } = req.body;
    if (!newPriceId) {
      return res.status(400).json({ message: 'newPriceId is required.' });
    }

    const user = await User.findById(req.userId);
    const subId = user.stripeSubscriptionId;
    if (!subId) {
      return res.status(400).json({ message: 'No active subscription to update.' });
    }

    // Retrieve current subscription item
    const subscription = await stripe.subscriptions.retrieve(subId);
    const itemId = subscription.items.data[0].id;

    // Update with proration
    const updated = await stripe.subscriptions.update(subId, {
      proration_behavior: 'create_prorations',
      items: [{ id: itemId, price: newPriceId }]
    });

    user.subscriptionStatus = updated.status;
    await user.save();

    res.json({ subscription: updated });
  } catch (err) {
    console.error('update-subscription error:', err);
    res.status(500).json({ message: 'Could not update subscription.' });
  }
});

router.post(
  '/confirm',
  ensureAuth,
  express.json(),           // ensure JSON body parsing
  async (req, res) => {
    try {
      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json({ message: 'sessionId is required' });
      }

      // 1) Retrieve the session
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (!session.subscription) {
        return res.status(400).json({ message: 'No subscription found on that session' });
      }

      // 2) Retrieve the subscription
      const subscription = await stripe.subscriptions.retrieve(session.subscription);

      // 3) Find your user by stripeCustomerId
      const user = await User.findOne({ stripeCustomerId: session.customer });
      if (!user) {
        return res.status(404).json({ message: 'User not found for that customer' });
      }

      // 4) Update your User record
      user.subscriptionStatus    = subscription.status;      // e.g. 'active'
      user.stripeSubscriptionId  = subscription.id;
      await user.save();

      return res.json({
        message: 'Subscription confirmed',
        subscription: {
          id:         subscription.id,
          status:     subscription.status,
          current_period_end: subscription.current_period_end,
        }
      });
    } catch (err) {
      console.error('confirm error:', err);
      return res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
