const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Connection = require('../models/Connection');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

function toDto(c) {
  if (!c) return null;
  const fromU = c.from && typeof c.from === 'object' ? c.from : null;
  const toU = c.to && typeof c.to === 'object' ? c.to : null;
  return {
    id: c._id.toString(),
    fromUserId: (fromU?._id ?? c.from)?.toString?.() ?? String(c.from ?? ''),
    toUserId: (toU?._id ?? c.to)?.toString?.() ?? String(c.to ?? ''),
    fromUserName: fromU?.name ?? '',
    toUserName: toU?.name ?? '',
    fromUserRole: fromU?.role ?? 'client',
    toUserRole: toU?.role ?? 'client',
    status: c.status,
    message: c.message,
    createdAt: c.createdAt,
    acceptedAt: c.acceptedAt,
  };
}

// GET /api/connections — all my connections (incoming + outgoing)
router.get('/', authenticate, async (req, res) => {
  try {
    const items = await Connection.find({
      $or: [{ from: req.userId }, { to: req.userId }]
    }).populate('from', 'name role').populate('to', 'name role').sort({ createdAt: -1 });
    res.json(items.map(toDto));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load connections', message: error.message });
  }
});

// POST /api/connections/request — { toUserId, message? }
router.post('/request', authenticate, async (req, res) => {
  try {
    const { toUserId, message } = req.body || {};
    if (!toUserId || !mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).json({ error: 'Invalid target user id' });
    }
    if (toUserId === req.userId.toString()) {
      return res.status(400).json({ error: 'Cannot connect with yourself' });
    }
    const target = await User.findById(toUserId);
    if (!target) return res.status(404).json({ error: 'Target user not found' });

    const existing = await Connection.findOne({
      $or: [
        { from: req.userId, to: toUserId },
        { from: toUserId, to: req.userId }
      ]
    }).populate('from', 'name role').populate('to', 'name role');
    if (existing) return res.json(toDto(existing));

    const doc = await Connection.create({
      from: req.userId,
      to: toUserId,
      message: message ? String(message).trim() : undefined
    });
    const populated = await doc.populate([{ path: 'from', select: 'name role' }, { path: 'to', select: 'name role' }]);
    res.status(201).json(toDto(populated));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Connection already exists' });
    }
    res.status(400).json({ error: 'Failed to create connection request', message: error.message });
  }
});

async function respond(req, res, status) {
  try {
    const conn = await Connection.findById(req.params.id);
    if (!conn) return res.status(404).json({ error: 'Connection not found' });
    if (conn.to.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Only the recipient can respond to this request' });
    }
    conn.status = status;
    if (status === 'accepted') conn.acceptedAt = new Date();
    await conn.save();
    const populated = await conn.populate([{ path: 'from', select: 'name role' }, { path: 'to', select: 'name role' }]);
    res.json(toDto(populated));
  } catch (error) {
    res.status(500).json({ error: `Failed to ${status} connection`, message: error.message });
  }
}

router.post('/:id/accept', authenticate, (req, res) => respond(req, res, 'accepted'));
router.post('/:id/reject', authenticate, (req, res) => respond(req, res, 'rejected'));

// DELETE /api/connections/:id — requester may cancel, or either side may remove an accepted one
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const conn = await Connection.findById(req.params.id);
    if (!conn) return res.status(404).json({ error: 'Connection not found' });
    const mine = conn.from.toString() === req.userId.toString() || conn.to.toString() === req.userId.toString();
    if (!mine) return res.status(403).json({ error: 'Not allowed' });
    await conn.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete connection', message: error.message });
  }
});

module.exports = router;
