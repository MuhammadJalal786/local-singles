const express     = require('express');
const router      = express.Router();
const User        = require('../../models/User');
const Event       = require('../../models/Event');
const Message     = require('../../models/Message');
const ensureAdmin = require('../../middleware/ensureAdmin');

// Compute age in years from DOB
function computeAge(dob) {
  const diffMs = Date.now() - dob.getTime();
  const ageDt  = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}

/**
 * GET /api/admin/users
 * Query params: search (string), page (int), limit (int)
 * Returns paginated list of users with computed age, etc.
 */
router.get('/', ensureAdmin, async (req, res) => {
  try {
    const { search = '', page = 1, limit = 20 } = req.query;
    const pg = Math.max(1, parseInt(page));
    const lt = Math.max(1, parseInt(limit));
    const skip = (pg - 1) * lt;

    // Build search filter
    const filter = {};
    if (search.length > 0) {
      const re = new RegExp(search, 'i');
      filter.$or = [
        { firstName: re },
        { lastName:  re },
        { email:     re }
      ];
    }

    const [total, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(lt)
        .lean()
    ]);

    // Map to DTOs
    const results = users.map(u => ({
      userId:             u._id,
      firstName:          u.firstName,
      lastName:           u.lastName,
      email:              u.email,
      city:               u.city,
      age:                u.dob ? computeAge(u.dob) : null,
      subscriptionStatus: u.subscriptionStatus,
      createdAt:          u.createdAt,
      isBlocked:          u.isBlocked,
      labels:             u.labels || []
    }));

    res.json({
      users:      results,
      page:       pg,
      totalPages: Math.ceil(total / lt),
      total
    });
  } catch (err) {
    console.error('GET /api/admin/users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /api/admin/users/:id/status
 * Body: { status: 'inactive'|'trialing'|'active'|'cancelled' }
 */
router.put('/:id/status', ensureAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['inactive','trialing','active','cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const u = await User.findByIdAndUpdate(
      req.params.id,
      { subscriptionStatus: status },
      { new: true }
    ).lean();
    if (!u) return res.status(404).json({ message: 'User not found' });
    return res.json({ userId: u._id, subscriptionStatus: u.subscriptionStatus });
  } catch (err) {
    console.error('PUT /api/admin/users/:id/status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /api/admin/users/:id/block
 * Body: { block: boolean }
 */
router.put('/:id/block', ensureAdmin, async (req, res) => {
  try {
    const { block } = req.body;
    const u = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: !!block },
      { new: true }
    ).lean();
    if (!u) return res.status(404).json({ message: 'User not found' });
    return res.json({ userId: u._id, isBlocked: u.isBlocked });
  } catch (err) {
    console.error('PUT /api/admin/users/:id/block error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
