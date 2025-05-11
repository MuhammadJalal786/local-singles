// backend/routes/webhook.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

// raw body is required for webhook signature verification
router.post(
  '/',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('⚠️  Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        // session.customer is the Stripe Customer ID
        const user = await User.findOne({ stripeCustomerId: session.customer });
        if (user) {
          user.subscriptionStatus = 'active';
          // optional: store the subscription ID
          user.stripeSubscriptionId = session.subscription;
          await user.save();
          console.log(`✅ Marked ${user.email} active`);
        }
        break;
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const user = await User.findOne({ stripeCustomerId: sub.customer });
        if (user) {
          // sync status (active, past_due, canceled, etc)
          user.subscriptionStatus = sub.status;
          await user.save();
          console.log(`🔄 Updated ${user.email} to ${sub.status}`);
        }
        break;
      }
      // you can listen for invoice.payment_failed, customer.subscription.deleted, etc
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 to acknowledge receipt of the event
    res.json({ received: true });
  }
);

module.exports = router;
