const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const { optionalAuth, authenticate } = require('../middleware/auth');

// Helpers to project public data safely
function projectPublic(u) {
  if (!u) return null;
  return {
    id: u._id?.toString?.() ?? String(u.id ?? ''),
    _id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    phone: u.phone,
    city: u.city,
    specialty: u.specialty,
    bio: u.bio,
    yearsExperience: u.yearsExperience,
    avatarUri: u.avatarUri,
    companyName: u.companyName,
    website: u.website,
  };
}

// ===== Search users (public profile list) =====
// GET /api/users/search?q=...&role=contractor|client
router.get('/search', optionalAuth, async (req, res) => {
  try {
    const { q = '', role } = req.query;
    const query = {};
    if (role === 'contractor' || role === 'client') query.role = role;
    const text = String(q).trim();
    if (text.length > 0) {
      const safe = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(safe, 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { city: regex },
        { specialty: regex },
        { companyName: regex }
      ];
    }
    const users = await User.find(query).select('-password -resetPasswordToken -resetPasswordExpires').limit(100);
    res.json(users.map(projectPublic));
  } catch (error) {
    console.error('Users search error:', error);
    res.status(500).json({ error: 'Failed to search users', message: error.message });
  }
});

// GET /api/users/me/profile — my editable public extras
router.get('/me/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(projectPublic(user));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load profile', message: error.message });
  }
});

// PUT /api/users/me/profile — update my public extras + avatar
router.put('/me/profile', authenticate, async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'city', 'specialty', 'bio', 'yearsExperience', 'avatarUri', 'companyName', 'website'];
    const patch = {};
    for (const k of allowed) if (k in req.body) patch[k] = req.body[k];
    const user = await User.findByIdAndUpdate(req.userId, patch, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(projectPublic(user));
  } catch (error) {
    console.error('Update me/profile error:', error);
    res.status(400).json({ error: 'Failed to update profile', message: error.message });
  }
});

// GET /api/users — list users (optional role filter)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query).select('-password');
    res.json(users.map(projectPublic));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', message: error.message });
  }
});

// GET /api/users/:id — full basic info
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(projectPublic(user));
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user', message: error.message });
  }
});

// GET /api/users/:id/profile — public profile with aggregates (rating avg + count)
router.get('/:id/profile', optionalAuth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const Rating = mongoose.models.Rating;
    const Portfolio = mongoose.models.Portfolio;
    const Connection = mongoose.models.Connection;
    let ratingAvg = 0, ratingCount = 0, completedProjects = 0, followers = 0, following = 0;
    if (Rating) {
      const agg = await Rating.aggregate([
        { $match: { target: user._id } },
        { $group: { _id: null, avg: { $avg: '$stars' }, count: { $sum: 1 } } }
      ]);
      if (agg[0]) { ratingAvg = agg[0].avg; ratingCount = agg[0].count; }
    }
    if (Portfolio) {
      completedProjects = await Portfolio.countDocuments({ user: user._id });
    }
    if (Connection) {
      followers = await Connection.countDocuments({ to: user._id, status: 'accepted' });
      following = await Connection.countDocuments({ from: user._id, status: 'accepted' });
    }

    res.json({
      ...projectPublic(user),
      ratingAvg: Number(ratingAvg.toFixed(2)),
      ratingCount,
      completedProjects,
      followers,
      following
    });
  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({ error: 'Failed to load public profile', message: error.message });
  }
});

// PUT /api/users/:id — only self
router.put('/:id', authenticate, async (req, res) => {
  try {
    if (req.params.id !== req.userId.toString()) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }
    const { password, role, ...updateData } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(projectPublic(user));
  } catch (error) {
    res.status(400).json({ error: 'Failed to update user', message: error.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    if (req.params.id !== req.userId.toString()) {
      return res.status(403).json({ error: 'You can only delete your own account' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user', message: error.message });
  }
});

module.exports = router;
