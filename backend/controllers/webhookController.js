// backend/controllers/webhookController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User   = require('../models/User');

exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session        = event.data.object;
    const customerId     = session.customer;
    const subscriptionId = session.subscription;

    const user = await User.findOne({ stripeCustomerId: customerId });
    if (user) {
      user.stripeSubscriptionId = subscriptionId;
      user.subscriptionStatus   = 'active';
      user.trialEndsAt          = undefined;
      await user.save();
      console.log(`✅ Updated subscription for user ${user.email}`);
    }
  }

  res.json({ received: true });
};
