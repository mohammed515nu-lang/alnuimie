const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const Rating = require('../models/Rating');
const Portfolio = require('../models/Portfolio');
const Transfer = require('../models/Transfer');
const Payment = require('../models/Payment');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const ChatReport = require('../models/ChatReport');
const Dispute = require('../models/Dispute');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

const router = express.Router();
router.use(authenticate, requireAdmin);

function userDto(u) {
  if (!u) return null;
  return {
    id: u._id.toString(),
    _id: u._id.toString(),
    name: u.name,
    email: u.email,
    role: u.role,
    accountStatus: u.accountStatus || 'active',
    suspendedReason: u.suspendedReason || '',
    walletFrozen: !!u.walletFrozen,
    googleId: u.googleId ? 'linked' : '',
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

function portfolioDto(p) {
  const o = p.user && typeof p.user === 'object' ? p.user : null;
  return {
    id: p._id.toString(),
    userId: (o?._id ?? p.user)?.toString?.() ?? String(p.user),
    ownerName: o?.name ?? '',
    title: p.title,
    description: p.description,
    imageUris: p.imageUris || [],
    moderationStatus: p.moderationStatus || 'approved',
    moderationNote: p.moderationNote || '',
    createdAt: p.createdAt,
  };
}

const LARGE_TRANSFER_USD = Number(process.env.ADMIN_LARGE_TRANSFER_USD || 500);

// ---------- Users ----------
router.get('/users', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(String(req.query.limit || '20'), 10) || 20));
    const q = String(req.query.q || '').trim();
    const filter = {};
    if (q) {
      filter.$or = [
        { name: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
        { email: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
      ];
    }
    const [items, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).select('-password'),
      User.countDocuments(filter),
    ]);
    res.json({ users: items.map(userDto), total, page, limit });
  } catch (e) {
    res.status(500).json({ error: 'Failed to list users', message: e.message });
  }
});

router.patch('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
    if (id === req.userId.toString()) {
      return res.status(400).json({ error: 'لا يمكن تعديل حسابك الحالي من هذه الشاشة بهذه الطريقة' });
    }

    const { role, accountStatus, suspendedReason, walletFrozen } = req.body || {};
    const update = {};
    if (role !== undefined) {
      if (!['client', 'contractor', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }
      update.role = role;
    }
    if (accountStatus !== undefined) {
      if (!['active', 'suspended', 'pending'].includes(accountStatus)) {
        return res.status(400).json({ error: 'Invalid accountStatus' });
      }
      update.accountStatus = accountStatus;
    }
    if (suspendedReason !== undefined) update.suspendedReason = String(suspendedReason).slice(0, 500);
    if (walletFrozen !== undefined) update.walletFrozen = !!walletFrozen;

    const user = await User.findByIdAndUpdate(id, { $set: update }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: userDto(user) });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update user', message: e.message });
  }
});

router.post('/users/:id/reset-password', async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });

    const plain = crypto.randomBytes(9).toString('base64url').slice(0, 12);
    const hashedPassword = await bcrypt.hash(plain, 10);
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { password: hashedPassword } },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      message: 'تم تعيين كلمة مرور مؤقتة',
      temporaryPassword: plain,
      user: userDto(user),
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to reset password', message: e.message });
  }
});

// ---------- Ratings ----------
router.get('/ratings', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(String(req.query.limit || '25'), 10) || 25));
    const [items, total] = await Promise.all([
      Rating.find({})
        .populate('from', 'name email role')
        .populate('target', 'name email role')
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Rating.countDocuments({}),
    ]);
    const rows = items.map((r) => ({
      id: r._id.toString(),
      stars: r.stars,
      comment: r.comment || '',
      from: r.from ? { id: r.from._id, name: r.from.name, email: r.from.email } : {},
      target: r.target ? { id: r.target._id, name: r.target.name } : {},
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
    res.json({ ratings: rows, total, page, limit });
  } catch (e) {
    res.status(500).json({ error: 'Failed to list ratings', message: e.message });
  }
});

router.delete('/ratings/:id', async (req, res) => {
  try {
    const doc = await Rating.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Rating not found' });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete rating', message: e.message });
  }
});

// ---------- Portfolio moderation ----------
router.get('/portfolio', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1);
    const limit = Math.min(40, Math.max(5, parseInt(String(req.query.limit || '20'), 10) || 20));
    const status = String(req.query.status || '').trim();
    const filter = {};
    if (status && ['approved', 'pending_review', 'hidden'].includes(status)) {
      filter.moderationStatus = status;
    }
    const [items, total] = await Promise.all([
      Portfolio.find(filter).populate('user', 'name email role').sort({ updatedAt: -1 }).skip((page - 1) * limit).limit(limit),
      Portfolio.countDocuments(filter),
    ]);
    res.json({ items: items.map(portfolioDto), total, page, limit });
  } catch (e) {
    res.status(500).json({ error: 'Failed to list portfolio', message: e.message });
  }
});

router.patch('/portfolio/:id', async (req, res) => {
  try {
    const { moderationStatus, moderationNote } = req.body || {};
    const update = {};
    if (moderationStatus !== undefined) {
      if (!['approved', 'pending_review', 'hidden'].includes(moderationStatus)) {
        return res.status(400).json({ error: 'Invalid moderationStatus' });
      }
      update.moderationStatus = moderationStatus;
    }
    if (moderationNote !== undefined) update.moderationNote = String(moderationNote).slice(0, 500);

    const p = await Portfolio.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).populate('user', 'name email role');
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json({ item: portfolioDto(p) });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update portfolio', message: e.message });
  }
});

// ---------- Chat reports & messages ----------
router.get('/reports', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1);
    const limit = Math.min(40, Math.max(5, parseInt(String(req.query.limit || '20'), 10) || 20));
    const status = String(req.query.status || '').trim();
    const filter = {};
    if (status && ['open', 'reviewing', 'resolved', 'dismissed'].includes(status)) {
      filter.status = status;
    }
    const [items, total] = await Promise.all([
      ChatReport.find(filter)
        .populate('conversation')
        .populate('reporter', 'name email')
        .populate('reportedUser', 'name email role')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      ChatReport.countDocuments(filter),
    ]);
    const rows = items.map((r) => ({
      id: r._id.toString(),
      conversationId: r.conversation?._id?.toString?.() ?? String(r.conversation),
      reporter: r.reporter ? { id: r.reporter._id, name: r.reporter.name } : {},
      reportedUser: r.reportedUser ? { id: r.reportedUser._id, name: r.reportedUser.name } : {},
      reason: r.reason,
      details: r.details || '',
      status: r.status,
      adminNotes: r.adminNotes || '',
      createdAt: r.createdAt,
    }));
    res.json({ reports: rows, total, page, limit });
  } catch (e) {
    res.status(500).json({ error: 'Failed to list reports', message: e.message });
  }
});

router.post('/reports', async (req, res) => {
  try {
    const { conversationId, reporterId, reportedUserId, reason, details } = req.body || {};
    if (!conversationId || !reason) {
      return res.status(400).json({ error: 'conversationId و reason مطلوبان' });
    }
    const doc = await ChatReport.create({
      conversation: conversationId,
      reporter: reporterId || req.userId,
      reportedUser: reportedUserId || undefined,
      reason: String(reason).slice(0, 500),
      details: details ? String(details).slice(0, 2000) : '',
      status: 'open',
    });
    res.status(201).json({ id: doc._id.toString() });
  } catch (e) {
    res.status(500).json({ error: 'Failed to create report', message: e.message });
  }
});

router.patch('/reports/:id', async (req, res) => {
  try {
    const { status, adminNotes } = req.body || {};
    const update = {};
    if (status !== undefined) {
      if (!['open', 'reviewing', 'resolved', 'dismissed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      update.status = status;
      if (status === 'resolved' || status === 'dismissed') update.resolvedAt = new Date();
    }
    if (adminNotes !== undefined) update.adminNotes = String(adminNotes).slice(0, 2000);

    const r = await ChatReport.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!r) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update report', message: e.message });
  }
});

router.get('/chats/:conversationId/messages', async (req, res) => {
  try {
    const cid = req.params.conversationId;
    const conv = await Conversation.findById(cid);
    if (!conv) return res.status(404).json({ error: 'Conversation not found' });

    const limit = Math.min(200, Math.max(10, parseInt(String(req.query.limit || '80'), 10) || 80));
    const msgs = await Message.find({ conversation: cid })
      .populate('sender', 'name role')
      .sort({ createdAt: -1 })
      .limit(limit);

    const rows = msgs.reverse().map((m) => ({
      id: m._id.toString(),
      senderId: m.sender ? m.sender._id.toString() : '',
      senderName: m.sender?.name ?? '',
      text: m.text ?? '',
      timestamp: m.createdAt ? new Date(m.createdAt).toISOString() : '',
    }));
    res.json({ messages: rows });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load messages', message: e.message });
  }
});

// ---------- Disputes ----------
router.get('/disputes', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1);
    const limit = Math.min(40, Math.max(5, parseInt(String(req.query.limit || '20'), 10) || 20));
    const [items, total] = await Promise.all([
      Dispute.find({})
        .populate('project', 'name')
        .populate('openedBy', 'name email')
        .populate('respondent', 'name email')
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Dispute.countDocuments({}),
    ]);
    const rows = items.map((d) => ({
      id: d._id.toString(),
      title: d.title,
      description: d.description,
      type: d.type,
      status: d.status,
      resolutionText: d.resolutionText,
      adminNotes: d.adminNotes,
      project: d.project ? { id: d.project._id, name: d.project.name } : null,
      openedBy: d.openedBy ? { id: d.openedBy._id, name: d.openedBy.name } : {},
      respondent: d.respondent ? { id: d.respondent._id, name: d.respondent.name } : null,
      updatedAt: d.updatedAt,
      createdAt: d.createdAt,
    }));
    res.json({ disputes: rows, total, page, limit });
  } catch (e) {
    res.status(500).json({ error: 'Failed to list disputes', message: e.message });
  }
});

router.post('/disputes', async (req, res) => {
  try {
    const { projectId, openedBy, respondentId, title, description, type } = req.body || {};
    if (!title || !openedBy) {
      return res.status(400).json({ error: 'title و openedBy مطلوبان' });
    }
    const d = await Dispute.create({
      project: projectId && mongoose.Types.ObjectId.isValid(projectId) ? projectId : undefined,
      openedBy,
      respondent: respondentId && mongoose.Types.ObjectId.isValid(respondentId) ? respondentId : undefined,
      title: String(title).slice(0, 200),
      description: description ? String(description).slice(0, 4000) : '',
      type: type && ['payment', 'delivery', 'quality', 'communication', 'other'].includes(type) ? type : 'other',
      status: 'open',
    });
    res.status(201).json({ id: d._id.toString() });
  } catch (e) {
    res.status(500).json({ error: 'Failed to create dispute', message: e.message });
  }
});

router.patch('/disputes/:id', async (req, res) => {
  try {
    const { status, resolutionText, adminNotes } = req.body || {};
    const update = {};
    if (status !== undefined) {
      if (!['open', 'under_review', 'resolved', 'closed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      update.status = status;
    }
    if (resolutionText !== undefined) update.resolutionText = String(resolutionText).slice(0, 4000);
    if (adminNotes !== undefined) update.adminNotes = String(adminNotes).slice(0, 2000);

    const d = await Dispute.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!d) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update dispute', message: e.message });
  }
});

// ---------- Finance ----------
router.get('/finance/summary', async (req, res) => {
  try {
    const transferAgg = await Transfer.aggregate([
      { $group: { _id: '$status', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);
    const paymentAgg = await Payment.aggregate([
      { $group: { _id: '$paymentStatus', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);
    const large = await Transfer.find({
      amount: { $gte: LARGE_TRANSFER_USD },
      status: { $in: ['completed', 'processing', 'pending'] },
    })
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .sort({ amount: -1 })
      .limit(30);

    const largeRows = large.map((t) => ({
      id: t._id.toString(),
      amount: t.amount,
      currency: t.currency,
      status: t.status,
      type: t.type,
      stripePaymentIntentId: t.stripePaymentIntentId,
      fromName: t.fromUser?.name,
      toName: t.toUser?.name,
      createdAt: t.createdAt,
    }));

    res.json({
      transfersByStatus: transferAgg,
      paymentsByStatus: paymentAgg,
      largeTransferThresholdUsd: LARGE_TRANSFER_USD,
      largeTransfers: largeRows,
      stripeConfigured: !!stripe,
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to build finance summary', message: e.message });
  }
});

router.get('/transfers', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1);
    const limit = Math.min(50, Math.max(10, parseInt(String(req.query.limit || '25'), 10) || 25));
    const [items, total] = await Promise.all([
      Transfer.find({})
        .populate('fromUser', 'name email role')
        .populate('toUser', 'name email role')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Transfer.countDocuments({}),
    ]);
    const rows = items.map((t) => ({
      id: t._id.toString(),
      type: t.type,
      amount: t.amount,
      currency: t.currency,
      status: t.status,
      stripePaymentIntentId: t.stripePaymentIntentId,
      fromUserId: t.fromUser?._id?.toString(),
      fromName: t.fromUser?.name,
      toUserId: t.toUser?._id?.toString(),
      toName: t.toUser?.name,
      description: t.description,
      createdAt: t.createdAt,
    }));
    res.json({ transfers: rows, total, page, limit });
  } catch (e) {
    res.status(500).json({ error: 'Failed to list transfers', message: e.message });
  }
});

router.patch('/transfers/:id', async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const t = await Transfer.findByIdAndUpdate(req.params.id, { $set: { status } }, { new: true });
    if (!t) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true, transferId: t._id.toString(), status: t.status });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update transfer', message: e.message });
  }
});

router.post('/transfers/:id/stripe-refund', async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ error: 'Stripe not configured' });
    const t = await Transfer.findById(req.params.id);
    if (!t || !t.stripePaymentIntentId) {
      return res.status(400).json({ error: 'Transfer or PaymentIntent missing' });
    }
    const intent = await stripe.paymentIntents.retrieve(t.stripePaymentIntentId);
    const amountRefundable = intent.amount_received || intent.amount;
    if (!amountRefundable) {
      return res.status(400).json({ error: 'Nothing to refund' });
    }
    const refund = await stripe.refunds.create({ payment_intent: t.stripePaymentIntentId });
    t.status = 'refunded';
    await t.save();
    res.json({
      ok: true,
      refundId: refund.id,
      amount: refund.amount,
      currency: refund.currency,
      status: refund.status,
    });
  } catch (e) {
    res.status(500).json({ error: 'Refund failed', message: e.message });
  }
});

module.exports = router;
