const express    = require('express');
const router     = express.Router();
const Setting    = require('../../models/Setting');
const ensureAdmin = require('../../middleware/ensureAdmin');

router.use(ensureAdmin);

/**
 * GET /api/admin/settings/membershipPrice
 * Fetch current monthly membership price (defaults to $10 if unset).
 */
router.get('/membershipPrice', async (req, res) => {
  try {
    let s = await Setting.findOne({ key: 'membershipPrice' });
    if (!s) {
      s = await new Setting({ key: 'membershipPrice', value: 10 }).save();
    }
    return res.json({ price: s.value });
  } catch (err) {
    console.error('GET membershipPrice error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /api/admin/settings/membershipPrice
 * Body: { price: Number }
 * Update the monthly membership price.
 */
router.put('/membershipPrice', async (req, res) => {
  try {
    const { price } = req.body;
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ message: 'Invalid price' });
    }
    const s = await Setting.findOneAndUpdate(
      { key: 'membershipPrice' },
      { value: price },
      { upsert: true, new: true }
    );
    return res.json({ price: s.value });
  } catch (err) {
    console.error('PUT membershipPrice error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
