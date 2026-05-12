/**
 * يتطلب المستخدم الحالي role === 'admin' (بعد authenticate).
 */
function requireAdmin(req, res, next) {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Forbidden', message: 'يتطلب صلاحية مدير النظام' });
  }
  next();
}

module.exports = { requireAdmin };
