const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Rating = require('../models/Rating');
const User = require('../models/User');
const { authenticate, optionalAuth } = require('../middleware/auth');

function toDto(r) {
  if (!r) return null;
  const fromU = r.from && typeof r.from === 'object' ? r.from : null;
  return {
    id: r._id.toString(),
    targetUserId: (r.target?._id ?? r.target)?.toString?.() ?? String(r.target ?? ''),
    fromUserId: (fromU?._id ?? r.from)?.toString?.() ?? String(r.from ?? ''),
    fromUserName: fromU?.name ?? '',
    stars: r.stars,
    comment: r.comment,
    createdAt: r.createdAt,
  };
}

// GET /api/ratings/user/:userId
router.get('/user/:userId', optionalAuth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }
    const items = await Rating.find({ target: req.params.userId })
      .populate('from', 'name')
      .sort({ createdAt: -1 });
    res.json(items.map(toDto));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load ratings', message: error.message });
  }
});

// POST /api/ratings — { targetUserId, stars, comment? }
router.post('/', authenticate, async (req, res) => {
  try {
    const { targetUserId, stars, comment } = req.body || {};
    if (!targetUserId || !mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ error: 'Invalid target user id' });
    }
    if (targetUserId === req.userId.toString()) {
      return res.status(400).json({ error: 'Cannot rate yourself' });
    }
    const n = Number(stars);
    if (!(n >= 1 && n <= 5)) return res.status(400).json({ error: 'Stars must be between 1 and 5' });

    const target = await User.findById(targetUserId);
    if (!target) return res.status(404).json({ error: 'Target user not found' });

    const doc = await Rating.findOneAndUpdate(
      { target: targetUserId, from: req.userId },
      { target: targetUserId, from: req.userId, stars: n, comment: comment ? String(comment).trim() : undefined },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate('from', 'name');

    res.status(201).json(toDto(doc));
  } catch (error) {
    console.error('Rating create error:', error);
    res.status(400).json({ error: 'Failed to submit rating', message: error.message });
  }
});

// DELETE /api/ratings/:id — only the author
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const doc = await Rating.findOneAndDelete({ _id: req.params.id, from: req.userId });
    if (!doc) return res.status(404).json({ error: 'Rating not found or not yours' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete rating', message: error.message });
  }
});

module.exports = router;
