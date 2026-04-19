const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Connection = require('../models/Connection');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

function otherParticipant(conv, myId) {
  const others = (conv.participants || []).filter((p) => {
    const id = p && typeof p === 'object' ? p._id : p;
    return id?.toString() !== myId.toString();
  });
  const o = others[0];
  if (!o) return { id: '', name: '', role: 'client' };
  if (typeof o === 'object') {
    return { id: o._id?.toString?.() ?? String(o), name: o.name ?? '', role: o.role ?? 'client' };
  }
  return { id: String(o), name: '', role: 'client' };
}

function threadDto(conv, myId) {
  const other = otherParticipant(conv, myId);
  const unreadMap = conv.unread ? (conv.unread instanceof Map ? Object.fromEntries(conv.unread) : conv.unread) : {};
  const unread = Number(unreadMap?.[myId.toString()] ?? 0);
  return {
    id: conv._id.toString(),
    otherUserId: other.id,
    otherUserName: other.name,
    otherUserRole: other.role,
    lastMessage: conv.lastMessage,
    lastTime: conv.lastMessageAt ? new Date(conv.lastMessageAt).toISOString() : undefined,
    lastSenderId: conv.lastSender ? conv.lastSender.toString() : undefined,
    unread
  };
}

function messageDto(m) {
  return {
    id: m._id.toString(),
    conversationId: m.conversation.toString(),
    senderId: (m.sender?._id ?? m.sender).toString?.() ?? String(m.sender),
    senderName: m.sender?.name ?? '',
    text: m.text,
    timestamp: m.createdAt ? new Date(m.createdAt).toISOString() : new Date().toISOString(),
  };
}

// GET /api/chats — my chat threads
router.get('/', authenticate, async (req, res) => {
  try {
    const convs = await Conversation.find({ participants: req.userId })
      .populate('participants', 'name role')
      .sort({ lastMessageAt: -1, updatedAt: -1 });
    res.json(convs.map((c) => threadDto(c, req.userId)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load chats', message: error.message });
  }
});

// POST /api/chats — ensure a thread with another user. Body: { otherUserId }
router.post('/', authenticate, async (req, res) => {
  try {
    const { otherUserId } = req.body || {};
    if (!otherUserId || !mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ error: 'Invalid other user id' });
    }
    if (otherUserId === req.userId.toString()) {
      return res.status(400).json({ error: 'Cannot chat with yourself' });
    }
    const other = await User.findById(otherUserId).select('name role');
    if (!other) return res.status(404).json({ error: 'User not found' });

    // Must be connected (accepted) to chat
    const connected = await Connection.findOne({
      status: 'accepted',
      $or: [
        { from: req.userId, to: otherUserId },
        { from: otherUserId, to: req.userId }
      ]
    });
    if (!connected) {
      return res.status(403).json({ error: 'You must be connected to chat with this user' });
    }

    let conv = await Conversation.findOne({
      participants: { $all: [req.userId, otherUserId], $size: 2 }
    }).populate('participants', 'name role');

    if (!conv) {
      conv = await Conversation.create({
        participants: [req.userId, otherUserId],
        unread: {}
      });
      conv = await conv.populate('participants', 'name role');
    }

    res.json(threadDto(conv, req.userId));
  } catch (error) {
    console.error('Ensure chat error:', error);
    res.status(500).json({ error: 'Failed to open chat', message: error.message });
  }
});

// GET /api/chats/:id/messages?before=ISO&limit=50
router.get('/:id/messages', authenticate, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid conversation id' });
    }
    const conv = await Conversation.findById(req.params.id);
    if (!conv) return res.status(404).json({ error: 'Conversation not found' });
    if (!conv.participants.some((p) => p.toString() === req.userId.toString())) {
      return res.status(403).json({ error: 'Not a participant' });
    }
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
    const filter = { conversation: conv._id };
    if (req.query.before) {
      const d = new Date(req.query.before);
      if (!isNaN(d.getTime())) filter.createdAt = { $lt: d };
    }
    const msgs = await Message.find(filter).populate('sender', 'name').sort({ createdAt: -1 }).limit(limit);
    // Return in chronological order
    res.json(msgs.reverse().map(messageDto));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load messages', message: error.message });
  }
});

// POST /api/chats/:id/messages — { text }
router.post('/:id/messages', authenticate, async (req, res) => {
  try {
    const { text } = req.body || {};
    const clean = String(text ?? '').trim();
    if (clean.length === 0) return res.status(400).json({ error: 'Message cannot be empty' });
    if (clean.length > 4000) return res.status(400).json({ error: 'Message too long' });

    const conv = await Conversation.findById(req.params.id);
    if (!conv) return res.status(404).json({ error: 'Conversation not found' });
    if (!conv.participants.some((p) => p.toString() === req.userId.toString())) {
      return res.status(403).json({ error: 'Not a participant' });
    }

    const msg = await Message.create({
      conversation: conv._id,
      sender: req.userId,
      text: clean
    });

    conv.lastMessage = clean.slice(0, 200);
    conv.lastMessageAt = new Date();
    conv.lastSender = req.userId;
    // Increment unread for all other participants
    for (const p of conv.participants) {
      const pid = p.toString();
      if (pid !== req.userId.toString()) {
        const prev = Number(conv.unread?.get?.(pid) ?? conv.unread?.[pid] ?? 0);
        conv.unread.set ? conv.unread.set(pid, prev + 1) : (conv.unread[pid] = prev + 1);
      }
    }
    await conv.save();

    const populated = await msg.populate('sender', 'name');
    res.status(201).json(messageDto(populated));
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message', message: error.message });
  }
});

// POST /api/chats/:id/read — mark my unread counter to 0
router.post('/:id/read', authenticate, async (req, res) => {
  try {
    const conv = await Conversation.findById(req.params.id);
    if (!conv) return res.status(404).json({ error: 'Conversation not found' });
    if (!conv.participants.some((p) => p.toString() === req.userId.toString())) {
      return res.status(403).json({ error: 'Not a participant' });
    }
    if (conv.unread?.set) conv.unread.set(req.userId.toString(), 0);
    else conv.unread = { ...(conv.unread || {}), [req.userId.toString()]: 0 };
    await conv.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark read', message: error.message });
  }
});

module.exports = router;
