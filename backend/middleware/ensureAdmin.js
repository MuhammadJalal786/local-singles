// backend/middleware/ensureAdmin.js
module.exports = function ensureAdmin(req, res, next) {
  // We assume req.session.user is populated by your login flow
  if (req.session?.user?.isAdmin) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: admins only' });
};
